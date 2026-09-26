import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { auth, db, functions } from '../../firebase';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';
import { CheckCircle2, RefreshCw, Search, ShieldCheck, Users } from 'lucide-react';

interface Listing {
    id: string;
    fullName?: string;
    email?: string;
    city?: string;
    state?: string;
    role?: string;
    verified?: boolean;
    createdAt?: string | { toDate?: () => Date };
    affiliateCode?: string;
    referredBy?: string;
    commissionRate?: number;
    services?: string[];
    subscriptionStatus?: string;
    listingStatus?: 'active' | 'hidden';
}

type Section = 'review' | 'all' | 'hidden' | 'referrals';

interface Report {
    id: string;
    notaryId: string;
    notaryName: string;
    reason: string;
    details: string;
    status: 'open' | 'resolved';
    createdAt?: string | { toDate?: () => Date };
}

const previewListings: Listing[] = [
    { id: 'preview-1', fullName: 'Jordan Lee', email: 'jordan@example.com', city: 'Baltimore', state: 'Maryland', role: 'notary', verified: false, createdAt: '2026-09-24T12:00:00', services: ['Mobile Notary', 'Loan Signing'], affiliateCode: 'JORDAN01', commissionRate: 10, subscriptionStatus: 'active' },
    { id: 'preview-2', fullName: 'Alex Rivera', email: 'alex@example.com', city: 'Silver Spring', state: 'Maryland', role: 'tipic', verified: false, createdAt: '2026-09-22T12:00:00', services: ['Title Producer'], referredBy: 'JORDAN01', commissionRate: 10, subscriptionStatus: 'active' },
    { id: 'preview-3', fullName: 'Taylor Morgan', email: 'taylor@example.com', city: 'Washington', state: 'DC', role: 'notary', verified: true, createdAt: '2026-09-20T12:00:00', services: ['Apostille', 'Remote Online Notary'], affiliateCode: 'TAYLOR01', commissionRate: 12, subscriptionStatus: 'active' },
];

const previewReports: Report[] = [
    { id: 'preview-report-1', notaryId: 'preview-2', notaryName: 'Alex Rivera', reason: 'Inappropriate Content', details: 'The information in this sample profile needs owner review.', status: 'open', createdAt: '2026-09-25T12:00:00' }
];

function joinedDate(value?: Listing['createdAt']) {
    const date = typeof value === 'string' ? new Date(value) : value?.toDate?.();
    return date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString() : 'Date unavailable';
}

export default function AdminPanel() {
    const { user, isAdmin, loading: authLoading } = useAuth();
    const preview = import.meta.env.DEV && new URLSearchParams(window.location.search).get('preview') === '1';
    const [listings, setListings] = useState<Listing[]>([]);
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const [busyId, setBusyId] = useState<string | null>(null);
    const [section, setSection] = useState<Section>('review');
    const [view, setView] = useState<'members' | 'reports'>('members');
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<string | null>(null);
    const [selectedReport, setSelectedReport] = useState<string | null>(null);
    const [rateDraft, setRateDraft] = useState('');
    const [resetBusy, setResetBusy] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);

    const refresh = useCallback(async () => {
        setLoading(true);
        setError('');
        if (preview) {
            setListings(previewListings);
            setReports(previewReports);
            setLoading(false);
            return;
        }
        try {
            const [listingSnapshot, reportSnapshot] = await Promise.all([
                getDocs(collection(db, 'notaries')),
                getDocs(collection(db, 'reports'))
            ]);
            setListings(listingSnapshot.docs.map(item => ({ id: item.id, ...item.data() } as Listing)));
            setReports(reportSnapshot.docs.map(item => ({ id: item.id, ...item.data() } as Report)));
        } catch (cause) {
            console.error('Unable to load owner dashboard', cause);
            setError('Could not load listings. Check your connection and try again.');
        } finally {
            setLoading(false);
        }
    }, [preview]);

    useEffect(() => {
        if (isAdmin || preview) void refresh();
    }, [isAdmin, preview, refresh]);

    const pending = useMemo(() => listings.filter(item => !item.verified), [listings]);
    const referrals = useMemo(() => listings.filter(item => item.affiliateCode || item.referredBy), [listings]);
    const hidden = useMemo(() => listings.filter(item => item.listingStatus === 'hidden'), [listings]);
    const openReports = useMemo(() => reports.filter(item => item.status === 'open'), [reports]);
    const visible = useMemo(() => {
        const source = section === 'review' ? pending : section === 'referrals' ? referrals : section === 'hidden' ? hidden : listings;
        const term = search.trim().toLowerCase();
        return source.filter(item => [item.fullName, item.email, item.city, item.state, item.affiliateCode]
            .some(value => value?.toLowerCase().includes(term)))
            .sort((a, b) => {
                const aDate = typeof a.createdAt === 'string' ? Date.parse(a.createdAt) : a.createdAt?.toDate?.().getTime();
                const bDate = typeof b.createdAt === 'string' ? Date.parse(b.createdAt) : b.createdAt?.toDate?.().getTime();
                return (bDate || 0) - (aDate || 0);
            });
    }, [section, pending, referrals, hidden, listings, search]);

    const selectedListing = listings.find(item => item.id === selected);
    const activeReport = reports.find(item => item.id === selectedReport);

    const openListing = (item: Listing) => {
        setSelected(item.id);
        setRateDraft(String(item.commissionRate ?? 10));
        setNotice('');
    };

    const save = async (item: Listing, changes: Partial<Listing>, success: string) => {
        setBusyId(item.id);
        setError('');
        setNotice('');
        if (preview) {
            setListings(current => current.map(entry => entry.id === item.id ? { ...entry, ...changes } : entry));
            setNotice(`${success} This preview does not change live data.`);
            setBusyId(null);
            return;
        }
        try {
            await updateDoc(doc(db, 'notaries', item.id), changes);
            setListings(current => current.map(entry => entry.id === item.id ? { ...entry, ...changes } : entry));
            setNotice(success);
        } catch (cause) {
            console.error('Unable to save owner change', cause);
            setError('Change was not saved. Check your connection and try again.');
        } finally {
            setBusyId(null);
        }
    };

    const changeVerification = (item: Listing) => {
        const action = item.verified ? 'Remove verification from' : 'Verify';
        if (!window.confirm(`${action} ${item.fullName || item.email || 'this listing'}?`)) return;
        void save(item, { verified: !item.verified }, item.verified ? 'Verification removed.' : 'Listing verified.');
    };

    const saveRate = (item: Listing) => {
        const rate = Number(rateDraft);
        if (!rateDraft.trim() || !Number.isFinite(rate) || rate < 0 || rate > 100) {
            setError('Enter a commission rate from 0 to 100.');
            return;
        }
        void save(item, { commissionRate: rate }, 'Commission rate saved.');
    };

    const changeListingStatus = (item: Listing) => {
        const hiding = item.listingStatus !== 'hidden';
        const action = hiding ? 'Hide this member’s public listing' : 'Make this member’s listing public again';
        if (!window.confirm(`${action}? This does not change Stripe billing.`)) return;
        void save(item, { listingStatus: hiding ? 'hidden' : 'active' }, hiding ? 'Listing hidden from public pages.' : 'Listing is public again.');
    };

    const sendReset = async (item: Listing) => {
        setResetBusy(true);
        setError('');
        setNotice('');
        if (preview) {
            setNotice(`Preview: a reset email would be sent to the authentication email for ${item.fullName || 'this member'}. No email was sent.`);
            setResetBusy(false);
            return;
        }
        try {
            const lookup = httpsCallable<{ uid: string }, { email: string | null; disabled: boolean }>(functions, 'getMemberAccount');
            const { data } = await lookup({ uid: item.id });
            if (!data.email) throw new Error('This account has no email address.');
            if (data.disabled) throw new Error('This account is disabled.');
            if (!window.confirm(`Send a password reset email to ${data.email}? The member will choose their new password.`)) return;
            await sendPasswordResetEmail(auth, data.email);
            setNotice(`Password reset email sent to ${data.email}.`);
        } catch (cause) {
            console.error('Unable to send password reset', cause);
            setError(cause instanceof Error ? cause.message : 'Could not send the reset email.');
        } finally {
            setResetBusy(false);
        }
    };

    const changeReportStatus = async (item: Report) => {
        const status = item.status === 'open' ? 'resolved' : 'open';
        setBusyId(item.id);
        setError('');
        try {
            if (!preview) await updateDoc(doc(db, 'reports', item.id), { status });
            setReports(current => current.map(entry => entry.id === item.id ? { ...entry, status } : entry));
            setNotice(status === 'resolved' ? 'Report marked resolved.' : 'Report reopened.');
        } catch (cause) {
            console.error('Unable to update report', cause);
            setError('Report status could not be saved. Try again.');
        } finally {
            setBusyId(null);
        }
    };

    if (authLoading && !preview) return <div className="min-h-screen grid place-items-center">Checking access…</div>;
    if (!user && !preview) return <div className="min-h-screen grid place-items-center p-6 text-center"><div><h1 className="text-2xl font-semibold">Owner sign in required</h1><p className="mt-2 text-slate-600">Sign in with your owner account to manage listings.</p><button type="button" onClick={() => setLoginOpen(true)} className="mt-5 rounded-lg bg-blue-900 px-6 py-3 font-semibold text-white hover:bg-blue-800">Log In</button><div><Link to="/" className="mt-4 inline-block text-blue-700 underline">Back to home page</Link></div></div><LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} /></div>;
    if (!isAdmin && !preview) return <div className="min-h-screen grid place-items-center p-6 text-center"><div><h1 className="text-2xl font-semibold">This account does not have owner access</h1><p className="mt-2 text-slate-600">Contact the platform administrator if you think this is a mistake.</p><Link to="/dashboard" className="mt-4 inline-block text-blue-700 underline">Go to dashboard</Link></div></div>;

    return <div className="min-h-screen bg-slate-50 text-slate-900">
        <header className="bg-white border-b border-slate-200"><div className="max-w-7xl mx-auto px-5 py-5 flex flex-wrap items-center justify-between gap-4"><div><Link to="/" className="text-sm text-blue-700 hover:underline">← Back to website</Link><h1 className="text-3xl font-semibold mt-2">Owner dashboard</h1><p className="text-slate-600 mt-1">Manage listings, referrals, and member account help in one place.</p></div><button type="button" onClick={() => void refresh()} disabled={loading} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 font-medium hover:bg-slate-50 disabled:opacity-50"><RefreshCw size={17} /> Refresh</button></div></header>
        <main className="max-w-7xl mx-auto px-5 py-8">
            {preview && <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-900">Preview with sample listings. Changes here do not affect the live site.</div>}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-8">
                <button type="button" onClick={() => { setView('members'); setSection('review'); setSelected(null); }} className="text-left bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-500"><ShieldCheck className="text-amber-600" /><span className="block text-3xl font-bold mt-3">{pending.length}</span><span className="text-slate-600">Awaiting review</span></button>
                <button type="button" onClick={() => { setView('members'); setSection('all'); setSelected(null); }} className="text-left bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-500"><Users className="text-blue-600" /><span className="block text-3xl font-bold mt-3">{listings.length}</span><span className="text-slate-600">Total listings</span></button>
                <div className="bg-white rounded-xl border border-slate-200 p-5"><CheckCircle2 className="text-green-600" /><span className="block text-3xl font-bold mt-3">{listings.length - pending.length}</span><span className="text-slate-600">Verified listings</span></div>
                <button type="button" onClick={() => { setView('members'); setSection('hidden'); setSelected(null); }} className="text-left bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-500"><Users className="text-slate-500" /><span className="block text-3xl font-bold mt-3">{hidden.length}</span><span className="text-slate-600">Hidden listings</span></button>
                <button type="button" onClick={() => { setView('reports'); setSelectedReport(null); }} className="text-left bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-500"><ShieldCheck className="text-red-600" /><span className="block text-3xl font-bold mt-3">{openReports.length}</span><span className="text-slate-600">Open reports</span></button>
            </div>
            {error && <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">{error}</div>}
            {notice && <div role="status" className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">{notice}</div>}
            <nav className="flex gap-2 mb-6" aria-label="Owner dashboard sections"><button type="button" onClick={() => setView('members')} aria-current={view === 'members' ? 'page' : undefined} className={`rounded-lg px-5 py-2 font-medium ${view === 'members' ? 'bg-blue-900 text-white' : 'bg-white border border-slate-200'}`}>Members</button><button type="button" onClick={() => setView('reports')} aria-current={view === 'reports' ? 'page' : undefined} className={`rounded-lg px-5 py-2 font-medium ${view === 'reports' ? 'bg-blue-900 text-white' : 'bg-white border border-slate-200'}`}>Reports {openReports.length > 0 ? `(${openReports.length})` : ''}</button></nav>
            {view === 'members' ?
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_370px] items-start">
                <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="p-5 border-b border-slate-200"><h2 className="text-xl font-semibold">Listings</h2><p className="text-sm text-slate-600 mt-1">Choose a person to see details and take action.</p></div>
                    <div className="p-5 relative"><Search size={18} className="absolute left-8 top-8 text-slate-400" /><input aria-label="Search listings" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search name, email, city or code" className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-3" /></div>
                    <div className="px-5 pb-4 flex flex-wrap gap-2" aria-label="Listing categories">{([['review', `Needs review (${pending.length})`], ['all', 'All listings'], ['hidden', `Hidden (${hidden.length})`], ['referrals', 'Referrals']] as const).map(([key, label]) => <button key={key} type="button" onClick={() => { setSection(key); setSelected(null); }} aria-pressed={section === key} className={`rounded-full px-4 py-2 text-sm font-medium ${section === key ? 'bg-blue-900 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>{label}</button>)}</div>
                    {loading ? <p className="p-8 text-slate-600">Loading listings…</p> : visible.length === 0 ? <p className="p-8 text-slate-600">{search ? 'No listings match your search.' : section === 'review' ? 'No listings need review right now.' : 'No listings to show.'}</p> : <ul className="divide-y divide-slate-100">{visible.map(item => <li key={item.id}><button type="button" onClick={() => openListing(item)} className={`w-full text-left px-5 py-4 flex items-center justify-between gap-3 hover:bg-slate-50 ${selected === item.id ? 'bg-blue-50' : ''}`}><span className="min-w-0"><span className="block font-semibold truncate">{item.fullName || 'Unnamed listing'}</span><span className="block text-sm text-slate-600 truncate">{[item.city, item.state].filter(Boolean).join(', ') || item.email || 'Location unavailable'} · Joined {joinedDate(item.createdAt)}</span></span><span className={`text-xs rounded-full px-2 py-1 shrink-0 ${item.verified ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>{item.verified ? 'Verified' : 'Review'}</span></button></li>)}</ul>}
                </section>
                <aside className="bg-white rounded-xl border border-slate-200 p-5 lg:sticky lg:top-6">
                    {!selectedListing ? <div><h2 className="text-xl font-semibold">Select a listing</h2><p className="mt-2 text-slate-600">The person’s contact details, profile and management actions will appear here.</p></div> : <div>
                        <h2 className="text-xl font-semibold">{selectedListing.fullName || 'Unnamed listing'}</h2><p className="text-sm text-slate-600 mt-1">{selectedListing.role === 'tipic' ? 'Title producer' : 'Notary'} · {selectedListing.verified ? 'Verified' : 'Awaiting review'} · {selectedListing.listingStatus === 'hidden' ? 'Hidden' : 'Public'}</p>
                        <dl className="mt-6 space-y-3 text-sm"><div><dt className="font-semibold">Email</dt><dd className="break-all">{selectedListing.email ? <a className="text-blue-700 underline" href={`mailto:${selectedListing.email}`}>{selectedListing.email}</a> : 'Unavailable'}</dd></div><div><dt className="font-semibold">Location</dt><dd>{[selectedListing.city, selectedListing.state].filter(Boolean).join(', ') || 'Unavailable'}</dd></div><div><dt className="font-semibold">Services</dt><dd>{selectedListing.services?.join(', ') || 'Not provided'}</dd></div><div><dt className="font-semibold">Joined</dt><dd>{joinedDate(selectedListing.createdAt)}</dd></div><div><dt className="font-semibold">Listing status</dt><dd>{selectedListing.listingStatus === 'hidden' ? 'Hidden' : 'Public'}</dd></div></dl>
                        {preview ? <p className="mt-5 text-sm text-slate-500">Public profile links are available with live listings.</p> : <Link to={`/profile/${selectedListing.id}`} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block text-blue-700 underline">View public profile ↗</Link>}
                        <div className="border-t border-slate-200 mt-6 pt-5"><h3 className="font-semibold">Verification</h3><p className="text-sm text-slate-600 mt-1">Review the profile and supporting information before marking it verified.</p><button type="button" disabled={busyId === selectedListing.id} onClick={() => changeVerification(selectedListing)} className={`mt-3 w-full rounded-lg px-4 py-3 font-semibold disabled:opacity-50 ${selectedListing.verified ? 'border border-amber-600 text-amber-800 hover:bg-amber-50' : 'bg-green-700 text-white hover:bg-green-800'}`}>{busyId === selectedListing.id ? 'Saving…' : selectedListing.verified ? 'Remove verification' : 'Mark as verified'}</button></div>
                        <div className="border-t border-slate-200 mt-6 pt-5"><h3 className="font-semibold">Listing visibility</h3><p className="text-sm text-slate-600 mt-1">{selectedListing.listingStatus === 'hidden' ? 'This listing is hidden from public search and profiles.' : 'This listing is visible to visitors.'} Billing is managed separately.</p><button type="button" disabled={busyId === selectedListing.id} onClick={() => changeListingStatus(selectedListing)} className="mt-3 w-full rounded-lg border border-slate-300 px-4 py-3 font-semibold hover:bg-slate-50 disabled:opacity-50">{selectedListing.listingStatus === 'hidden' ? 'Make listing public' : 'Hide listing'}</button></div>
                        <div className="border-t border-slate-200 mt-6 pt-5"><h3 className="font-semibold">Account access</h3><p className="text-sm text-slate-600 mt-1">Send a secure link so the member can choose a new password. Passwords are never shown here.</p><button type="button" disabled={resetBusy} onClick={() => void sendReset(selectedListing)} className="mt-3 w-full rounded-lg border border-slate-300 px-4 py-3 font-semibold hover:bg-slate-50 disabled:opacity-50">{resetBusy ? 'Sending…' : 'Send password reset email'}</button></div>
                        <div className="border-t border-slate-200 mt-6 pt-5"><h3 className="font-semibold">Referral details</h3><p className="text-sm mt-2">Code: <span className="font-mono">{selectedListing.affiliateCode || 'None'}</span></p><p className="text-sm mt-1">Referred by: <span className="font-mono">{selectedListing.referredBy || 'None'}</span></p><p className="text-sm mt-1">Signups using this code: {selectedListing.affiliateCode ? listings.filter(entry => entry.referredBy === selectedListing.affiliateCode).length : 0}</p><label htmlFor="commission-rate" className="block text-sm font-semibold mt-4">Commission rate (%)</label><div className="flex gap-2 mt-1"><input id="commission-rate" type="number" min="0" max="100" step="0.01" value={rateDraft} onChange={event => setRateDraft(event.target.value)} className="min-w-0 w-28 rounded-lg border border-slate-300 px-3 py-2" /><button type="button" disabled={busyId === selectedListing.id || rateDraft === String(selectedListing.commissionRate ?? 10)} onClick={() => saveRate(selectedListing)} className="rounded-lg bg-blue-900 px-4 py-2 text-white font-medium disabled:opacity-50">Save rate</button></div></div>
                    </div>}
                </aside>
            </div> : <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_370px] items-start">
                <section className="bg-white rounded-xl border border-slate-200 overflow-hidden"><div className="p-5 border-b border-slate-200"><h2 className="text-xl font-semibold">Profile reports</h2><p className="text-sm text-slate-600 mt-1">Review concerns submitted from public profiles.</p></div>{loading ? <p className="p-8 text-slate-600">Loading reports…</p> : reports.length === 0 ? <p className="p-8 text-slate-600">No reports have been submitted.</p> : <ul className="divide-y divide-slate-100">{[...reports].sort((a, b) => Number(a.status === 'resolved') - Number(b.status === 'resolved')).map(report => <li key={report.id}><button type="button" onClick={() => setSelectedReport(report.id)} className={`w-full text-left px-5 py-4 hover:bg-slate-50 ${selectedReport === report.id ? 'bg-blue-50' : ''}`}><span className="block font-semibold">{report.notaryName || 'Member'} · {report.reason}</span><span className="block text-sm text-slate-600 mt-1">{joinedDate(report.createdAt)} · {report.status === 'open' ? 'Needs review' : 'Resolved'}</span></button></li>)}</ul>}</section>
                <aside className="bg-white rounded-xl border border-slate-200 p-5 lg:sticky lg:top-6">{!activeReport ? <div><h2 className="text-xl font-semibold">Select a report</h2><p className="mt-2 text-slate-600">The report details and resolution action will appear here.</p></div> : <div><h2 className="text-xl font-semibold">{activeReport.reason}</h2><p className="text-sm text-slate-600 mt-1">{activeReport.notaryName} · {joinedDate(activeReport.createdAt)}</p><p className="mt-5 whitespace-pre-wrap break-words text-slate-800">{activeReport.details}</p>{preview ? <p className="mt-5 text-sm text-slate-500">Public profile links are available with live reports.</p> : <Link to={`/profile/${activeReport.notaryId}`} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block text-blue-700 underline">View reported profile ↗</Link>}<button type="button" disabled={busyId === activeReport.id} onClick={() => void changeReportStatus(activeReport)} className="mt-6 w-full rounded-lg bg-blue-900 px-4 py-3 text-white font-semibold disabled:opacity-50">{busyId === activeReport.id ? 'Saving…' : activeReport.status === 'open' ? 'Mark resolved' : 'Reopen report'}</button></div>}</aside>
            </div>}
        </main>
    </div>;
}
