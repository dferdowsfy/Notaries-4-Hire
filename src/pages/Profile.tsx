import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    MapPin, Star, Shield, Clock, Award, CheckCircle,
    Calendar, ChevronRight, MessageSquare, Share2, Flag,
    Menu, X, ArrowLeft, Phone, Mail
} from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import ContactModal from '../components/ContactModal';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
    const { userId } = useParams();
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('overview');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const targetId = userId || currentUser?.uid;
                if (!targetId) {
                    navigate('/');
                    return;
                }
                const docRef = doc(db, 'notaries', targetId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProfile(docSnap.data());
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [userId, currentUser, navigate]);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(id);
            setIsMobileMenuOpen(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#F5F7FB]">Loading...</div>;
    if (!profile) return <div className="min-h-screen flex items-center justify-center bg-[#F5F7FB]">Profile not found</div>;

    const navItems = [
        { id: 'overview', label: 'Overview', icon: Shield },
        { id: 'services', label: 'Services & Fees', icon: Award },
        { id: 'availability', label: 'Availability', icon: Calendar },
        { id: 'coverage', label: 'Coverage Area', icon: MapPin },
        { id: 'credentials', label: 'Credentials', icon: CheckCircle },
        { id: 'reviews', label: 'Reviews', icon: Star },
        { id: 'faqs', label: 'FAQs', icon: MessageSquare },
    ];

    return (
        <div className="min-h-screen bg-[#F5F7FB] font-sans text-[#1F2933]">
            {/* Mobile Header */}
            <div className="lg:hidden bg-white sticky top-0 z-50 px-4 py-3 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/')} className="p-2 hover:bg-slate-100 rounded-full">
                        <ArrowLeft className="w-5 h-5 text-[#102A43]" />
                    </button>
                    <h1 className="font-serif text-lg font-bold text-[#102A43]">Profile</h1>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Navigation Drawer */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="absolute right-0 top-0 bottom-0 w-64 bg-white shadow-xl p-4 pt-20" onClick={e => e.stopPropagation()}>
                        <nav className="space-y-2">
                            {navItems.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeSection === item.id
                                        ? 'bg-[#102A43] text-white'
                                        : 'text-[#6B7280] hover:bg-slate-50'
                                        }`}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Desktop Back Button */}
                <div className="hidden lg:block mb-6">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-[#6B7280] hover:text-[#102A43] transition-colors font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Notaries4Hire
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-3">
                        <div className="sticky top-8 space-y-6">
                            {/* Profile Card */}
                            <div className="bg-[#102A43] rounded-2xl p-6 text-white shadow-xl">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-24 h-24 rounded-full border-4 border-white/10 mb-4 overflow-hidden bg-white">
                                        {profile.photoUrl ? (
                                            <img src={profile.photoUrl} alt={profile.fullName} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[#102A43] font-bold text-2xl">
                                                {profile.fullName?.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <h2 className="text-xl font-bold font-serif mb-1">{profile.fullName}</h2>
                                    <div className="flex items-center gap-1 text-white/80 text-sm mb-3">
                                        <MapPin className="w-3 h-3" />
                                        {profile.city}, {profile.state}
                                    </div>
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="flex text-[#F4B740]">
                                            <Star className="w-4 h-4 fill-current" />
                                            <span className="ml-1 font-bold text-white">4.8</span>
                                        </div>
                                        <span className="text-white/60 text-sm">(24 reviews)</span>
                                    </div>

                                    <button
                                        onClick={() => setIsContactOpen(true)}
                                        className="w-full py-3 bg-[#F4B740] hover:bg-[#E0A839] text-[#102A43] font-bold rounded-lg mb-3 transition-colors"
                                    >
                                        Book Appointment
                                    </button>
                                    <button
                                        onClick={() => setIsContactOpen(true)}
                                        className="w-full py-3 border border-white/20 hover:bg-white/10 text-white font-medium rounded-lg transition-colors"
                                    >
                                        Message
                                    </button>
                                </div>
                            </div>

                            {/* Desktop Navigation */}
                            <nav className="hidden lg:block bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden">
                                {navItems.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => scrollToSection(item.id)}
                                        className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-medium transition-all border-l-4 ${activeSection === item.id
                                            ? 'border-[#F4B740] bg-slate-50 text-[#102A43]'
                                            : 'border-transparent text-[#6B7280] hover:bg-slate-50 hover:text-[#102A43]'
                                            }`}
                                    >
                                        <item.icon className={`w-4 h-4 ${activeSection === item.id ? 'text-[#F4B740]' : ''}`} />
                                        {item.label}
                                    </button>
                                ))}
                            </nav>

                            {/* Sidebar Footer */}
                            <div className="flex justify-center gap-6 text-sm text-[#6B7280]">
                                <button className="flex items-center gap-2 hover:text-[#102A43]">
                                    <Share2 className="w-4 h-4" /> Share
                                </button>
                                <button className="flex items-center gap-2 hover:text-red-600">
                                    <Flag className="w-4 h-4" /> Report
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-9 space-y-8">
                        {/* Overview */}
                        <section id="overview" className="bg-white rounded-2xl p-8 shadow-sm border border-[#E2E8F0]">
                            <h2 className="text-2xl font-serif font-bold text-[#102A43] mb-4">Overview</h2>
                            <div className="flex flex-wrap gap-2 mb-6">
                                <span className="px-3 py-1 bg-slate-100 text-[#102A43] rounded-full text-sm font-medium">Mobile Notary</span>
                                <span className="px-3 py-1 bg-slate-100 text-[#102A43] rounded-full text-sm font-medium">Spanish-speaking</span>
                                <span className="px-3 py-1 bg-slate-100 text-[#102A43] rounded-full text-sm font-medium">Loan Signing Agent</span>
                            </div>
                            <p className="text-[#6B7280] leading-relaxed mb-8">
                                {profile.bio || "Experienced notary public providing prompt and reliable mobile notary services. I specialize in loan signings and general notarizations, ensuring accuracy and professionalism in every appointment."}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-[#E2E8F0] pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#102A43]">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#6B7280]">Avg. Response</p>
                                        <p className="font-bold text-[#102A43]">20 mins</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#102A43]">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#6B7280]">Signings</p>
                                        <p className="font-bold text-[#102A43]">235+ Completed</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#102A43]">
                                        <Award className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#6B7280]">Experience</p>
                                        <p className="font-bold text-[#102A43]">5 Years</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Why Choose Me */}
                        <section className="bg-white rounded-2xl p-8 shadow-sm border border-[#E2E8F0]">
                            <h2 className="text-2xl font-serif font-bold text-[#102A43] mb-6">Why Clients Choose Me</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <ul className="space-y-4">
                                    {[
                                        'Certified & Insured for your peace of mind',
                                        'Evening & Weekend Availability',
                                        'Same-day appointments often available',
                                        'Travel to homes, offices, and hospitals'
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <div className="mt-1 w-5 h-5 rounded-full bg-[#F4B740]/20 flex items-center justify-center flex-shrink-0">
                                                <CheckCircle className="w-3 h-3 text-[#F4B740]" />
                                            </div>
                                            <span className="text-[#1F2933] font-medium">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="h-48 bg-slate-100 rounded-xl overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1000"
                                        alt="Notary working"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Services */}
                        <section id="services">
                            <h2 className="text-2xl font-serif font-bold text-[#102A43] mb-6">Services & Fees</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { name: 'General Notarization', price: '$40', unit: 'per signature', time: '15 min', type: 'Mobile' },
                                    { name: 'Loan Signing', price: '$150', unit: 'flat fee', time: '1-2 hrs', type: 'Mobile' },
                                    { name: 'Remote Notarization', price: '$25', unit: 'per signature', time: '15 min', type: 'Remote' },
                                    { name: 'Apostille Service', price: '$100', unit: 'starting at', time: 'Varies', type: 'Service' }
                                ].map((service, i) => (
                                    <div key={i} className="bg-white p-6 rounded-xl border border-[#E2E8F0] hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-[#102A43]">{service.name}</h3>
                                            <span className="px-2 py-1 bg-slate-100 text-xs font-bold text-[#6B7280] rounded uppercase">{service.type}</span>
                                        </div>
                                        <div className="flex items-baseline gap-1 mb-2">
                                            <span className="text-2xl font-bold text-[#102A43]">{service.price}</span>
                                            <span className="text-sm text-[#6B7280]">{service.unit}</span>
                                        </div>
                                        <p className="text-sm text-[#6B7280] flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> Typical duration: {service.time}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Availability */}
                        <section id="availability" className="bg-white rounded-2xl p-8 shadow-sm border border-[#E2E8F0]">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-serif font-bold text-[#102A43]">Availability</h2>
                                <button className="text-[#102A43] font-medium text-sm hover:underline">Request different time</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                                        <div key={day} className="flex justify-between text-sm">
                                            <span className="text-[#6B7280] font-medium">{day}</span>
                                            <span className="text-[#102A43]">09:00 AM – 06:00 PM</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between text-sm pt-2 border-t border-dashed border-slate-200">
                                        <span className="text-[#6B7280] font-medium">Saturday</span>
                                        <span className="text-[#102A43]">10:00 AM – 02:00 PM</span>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#102A43] mb-3 text-sm">Next Available Slots</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {['Today, 2:00 PM', 'Today, 4:30 PM', 'Tomorrow, 9:00 AM', 'Tomorrow, 11:00 AM'].map((slot, i) => (
                                            <button key={i} className="px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm text-[#102A43] hover:border-[#102A43] hover:bg-slate-50 transition-colors">
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Coverage Area */}
                        <section id="coverage" className="bg-white rounded-2xl p-8 shadow-sm border border-[#E2E8F0]">
                            <h2 className="text-2xl font-serif font-bold text-[#102A43] mb-4">Coverage Area</h2>
                            <p className="text-[#6B7280] mb-6">
                                I provide mobile notary services throughout {profile.city} and the surrounding areas. Travel fees may apply for locations outside of a 10-mile radius.
                            </p>
                            <div className="bg-slate-100 rounded-xl h-48 flex items-center justify-center text-[#6B7280]">
                                <div className="text-center">
                                    <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p className="font-medium">Map View Placeholder</p>
                                </div>
                            </div>
                        </section>

                        {/* Credentials */}
                        <section id="credentials">
                            <h2 className="text-2xl font-serif font-bold text-[#102A43] mb-6">Credentials</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'Licensed Notary', icon: Award },
                                    { label: 'Background Checked', icon: Shield },
                                    { label: 'Bonded & Insured', icon: CheckCircle },
                                    { label: 'NNA Member', icon: Star }
                                ].map((cred, i) => (
                                    <div key={i} className="bg-white p-4 rounded-xl border border-[#E2E8F0] flex flex-col items-center text-center gap-2">
                                        <div className="w-10 h-10 rounded-full bg-[#102A43]/5 flex items-center justify-center text-[#102A43]">
                                            <cred.icon className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-bold text-[#102A43]">{cred.label}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Reviews */}
                        <section id="reviews" className="bg-white rounded-2xl p-8 shadow-sm border border-[#E2E8F0]">
                            <h2 className="text-2xl font-serif font-bold text-[#102A43] mb-6">Reviews</h2>
                            <div className="flex flex-col md:flex-row gap-8 mb-8">
                                <div className="text-center md:text-left">
                                    <div className="text-5xl font-bold text-[#102A43] mb-1">4.8</div>
                                    <div className="flex justify-center md:justify-start text-[#F4B740] mb-1">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                                    </div>
                                    <p className="text-[#6B7280] text-sm">Based on 24 reviews</p>
                                </div>
                                <div className="flex-1 space-y-2">
                                    {[5, 4, 3, 2, 1].map((rating, i) => (
                                        <div key={rating} className="flex items-center gap-3">
                                            <span className="text-sm font-medium text-[#6B7280] w-3">{rating}</span>
                                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-[#F4B740] rounded-full"
                                                    style={{ width: i === 0 ? '80%' : i === 1 ? '15%' : '5%' }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-6">
                                {[
                                    { name: 'Sarah M.', date: '2 days ago', text: 'Darius was professional, punctual, and made the whole process incredibly easy. Highly recommend!' },
                                    { name: 'James L.', date: '1 week ago', text: 'Excellent service. Came to my office within an hour.' }
                                ].map((review, i) => (
                                    <div key={i} className="border-b border-[#E2E8F0] last:border-0 pb-6 last:pb-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-[#102A43]">{review.name}</h4>
                                            <span className="text-sm text-[#6B7280]">{review.date}</span>
                                        </div>
                                        <div className="flex text-[#F4B740] mb-2">
                                            {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3 h-3 fill-current" />)}
                                        </div>
                                        <p className="text-[#6B7280] text-sm">{review.text}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* FAQs */}
                        <section id="faqs" className="bg-white rounded-2xl p-8 shadow-sm border border-[#E2E8F0]">
                            <h2 className="text-2xl font-serif font-bold text-[#102A43] mb-6">Frequently Asked Questions</h2>
                            <div className="space-y-4">
                                {[
                                    { q: 'What do I need to bring to the appointment?', a: 'You will need a valid government-issued photo ID (driver\'s license, passport, etc.) and the document(s) to be notarized.' },
                                    { q: 'Do you offer same-day appointments?', a: 'Yes, I often have same-day availability. Please check the schedule or contact me directly to confirm.' },
                                    { q: 'Can you come to my hospital room?', a: 'Yes, I travel to hospitals, nursing homes, and assisted living facilities.' }
                                ].map((faq, i) => (
                                    <div key={i} className="border border-[#E2E8F0] rounded-xl p-4">
                                        <h3 className="font-bold text-[#102A43] mb-2 flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4 text-[#F4B740]" />
                                            {faq.q}
                                        </h3>
                                        <p className="text-[#6B7280] text-sm ml-6">{faq.a}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} notaryName={profile.fullName} />
        </div>
    );
}
