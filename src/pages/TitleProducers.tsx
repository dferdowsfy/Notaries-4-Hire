import React from 'react';
import { FileText, CheckCircle, Shield, Users, Briefcase, ArrowRight, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useModal } from '../context/ModalContext';

export default function TitleProducers() {
    const { openGetListed } = useModal();
    const navigate = useNavigate();

    const services = [
        { icon: FileText, label: 'Real Estate Settlement Services' },
        { icon: Users, label: 'Buyer & Seller Closings' },
        { icon: Briefcase, label: 'Refinance Closings' },
        { icon: FileText, label: 'Loan Package Execution' },
        { icon: Shield, label: 'Title Insurance Document Signatures' },
        { icon: Briefcase, label: 'Funding Document Coordination' },
        { icon: FileText, label: 'Mortgage, Deed & Lien Execution' },
        { icon: CheckCircle, label: 'Post-Closing Document Return' },
    ];

    const benefits = [
        'Accurate and compliant document execution',
        'Smooth communication during the transaction',
        'Secure handling of sensitive paperwork',
        'Faster, more flexible settlement options',
        'A seamless closing experience for all parties'
    ];

    const trustedBy = [
        'Title Companies',
        'Real Estate Agents',
        'Mortgage Lenders',
        'Attorneys',
        'Home Buyers & Sellers'
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-background">
            {/* Hero Section */}
            <section className="pt-40 pb-16 px-4 text-center max-w-5xl mx-auto">
                <h1 className="text-5xl md:text-6xl font-serif text-text mb-6 leading-tight">
                    Licensed Title, Settlement &<br />
                    <span className="font-bold text-accent">TIPIC Professionals</span>
                </h1>
                <p className="text-xl text-text-secondary mb-8 max-w-3xl mx-auto">
                    Find certified Title Producers, Settlement Agents, and TIPICs across the United States.
                </p>
                <p className="text-lg font-medium text-primary mb-12 italic">
                    "Professional. Certified. Trusted for Real Estate Closings."
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button
                        onClick={() => openGetListed('tipic')}
                        className="border-2 border-accent text-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-accent/10 transition-colors"
                    >
                        Get Listed as a TIPIC
                    </button>
                    <button
                        onClick={() => navigate('/search?type=title-producer')}
                        className="bg-primary text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-primary-hover transition-colors shadow-lg"
                    >
                        Find a Title Producer / TIPIC
                    </button>
                </div>
            </section>

            {/* What is a Title Producer? */}
            <section className="py-16 bg-slate-50 dark:bg-surface border-y border-slate-100 dark:border-slate-800">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-text mb-6">What Is a Title Producer or TIPIC?</h2>
                        <p className="text-text-secondary text-lg mb-6 leading-relaxed">
                            A Title Producer or TIPIC (Title Insurance Producer Independent Contractor) is a licensed professional authorized to conduct real estate settlements, explain and review closing documents, and handle title insurance forms.
                        </p>
                        <p className="text-text-secondary text-lg mb-6 leading-relaxed">
                            These professionals play a critical role in secure, accurate, and legally compliant real estate closings.
                        </p>
                        <ul className="space-y-3">
                            {[
                                'Conduct real estate settlements',
                                'Explain and review closing documents',
                                'Handle title insurance forms',
                                'Coordinate with lenders, agents, buyers, and sellers',
                                'Ensure compliance with state settlement and title regulations'
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                                    <span className="text-text font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
                        <img
                            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000"
                            alt="Real Estate Closing"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end p-8">
                            <div className="text-white">
                                <p className="font-bold text-xl mb-2">Expert Closing Services</p>
                                <p className="text-white/80">Ensuring smooth transactions for every deal.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-serif font-bold text-text mb-4">Services Provided</h2>
                    <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                        Title Producers, Settlement Agents, and TIPICs manage essential closing responsibilities.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service, index) => (
                        <div key={index} className="bg-white dark:bg-surface border border-slate-100 dark:border-slate-800 rounded-xl p-6 hover:shadow-lg hover:border-accent/30 transition-all group">
                            <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary mb-4 group-hover:bg-accent group-hover:text-primary transition-colors">
                                <service.icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-text text-lg mb-2">{service.label}</h3>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-text-secondary mb-4">Also including:</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {['Communication with lenders & title companies', 'Mobile or in-office settlement appointments'].map((extra, i) => (
                            <span key={i} className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-text rounded-full font-medium text-sm border border-slate-200 dark:border-slate-700">
                                {extra}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Section */}
            <section className="py-20 bg-primary text-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <div>
                            <h2 className="text-3xl font-serif font-bold mb-8">Why Choose Licensed Title Professionals & TIPICs?</h2>
                            <div className="space-y-6">
                                {benefits.map((benefit, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0 text-primary">
                                            <Check className="w-5 h-5" />
                                        </div>
                                        <p className="text-lg font-medium">{benefit}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                            <h3 className="text-2xl font-serif font-bold mb-6 text-accent">Trusted By</h3>
                            <div className="grid grid-cols-1 gap-4">
                                {trustedBy.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                        <span className="font-bold text-lg">{item}</span>
                                        <ArrowRight className="w-5 h-5 text-accent" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 px-6 text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-4xl font-serif font-bold text-text mb-6">Ready to Close Your Deal?</h2>
                    <p className="text-xl text-text-secondary mb-10">
                        Connect with a professional Title Producer or TIPIC today for a seamless closing experience.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button
                            onClick={() => openGetListed('tipic')}
                            className="bg-primary text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-primary-hover transition-colors shadow-lg"
                        >
                            Get Listed as a TIPIC
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
