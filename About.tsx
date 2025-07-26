import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface ServiceCardProps {
    icon: string;
    title: string;
    children: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({icon, title, children, style, className = ''}) => (
    <div className={`p-6 bg-white/20 rounded-lg transition-all duration-300 transform hover:scale-105 hover:bg-white/40 hover:shadow-2xl h-full ${className}`} style={style}>
        <div className="text-5xl text-[#FFD700] mb-4 drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]">{icon}</div>
        <h3 className="font-semibold text-xl text-slate-800 mb-2 drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]">{title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed">{children}</p>
    </div>
)

export const About: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="animate-fade-in-up space-y-12">
            <Card>
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="md:w-1/3 text-center flex-shrink-0">
                        <img
                            src="https://www.dvag.de/content/dam/vbdata/dvag/r/u/n/rune.kaemper/vbportrait_mask_01.png/jcr:content/renditions/cq5dam.heroimageportrait.png"
                            alt="Rune Kämper"
                            className="mx-auto h-48 w-48 rounded-full object-cover shadow-2xl border-4 border-white/80"
                        />
                        <h1 className="text-3xl font-bold font-montserrat mt-4 text-slate-900">Rune Kämper</h1>
                        <p className="text-blue-600 font-semibold">Ihr DVAG Vermögensberater</p>
                    </div>
                    <div className="md:w-2/3">
                        <h2 className="text-3xl font-bold font-montserrat text-slate-800 mb-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
                            Über Mich: Ihr Partner für eine sichere finanzielle Zukunft
                        </h2>
                        <p className="text-slate-700 mb-4 leading-relaxed">
                            Herzlich willkommen! Mein Name ist Rune Kämper und als Ihr persönlicher Vermögensberater der Deutschen Vermögensberatung (DVAG) stehe ich Ihnen mit Fachkompetenz und Leidenschaft zur Seite. Mein Ziel ist es, Ihnen dabei zu helfen, Ihre finanziellen Ziele zu erreichen und Ihre Zukunft abzusichern – transparent, verständlich und auf Ihre individuellen Bedürfnisse zugeschnitten.
                        </p>
                        <p className="text-slate-700 leading-relaxed">
                            Finanzplanung ist Vertrauenssache. Deshalb lege ich größten Wert auf eine offene und ehrliche Partnerschaft auf Augenhöhe. Gemeinsam analysieren wir Ihre aktuelle Situation, definieren Ihre Wünsche und entwickeln eine maßgeschneiderte Strategie für Ihren Vermögensaufbau.
                        </p>
                    </div>
                </div>
            </Card>
            
            <Card>
                <h2 className="text-center text-3xl font-bold font-montserrat text-slate-800 mb-8">Meine Leistungen für Sie</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <ServiceCard icon="🏦" title="Vermögensaufbau">
                        Ob kurz-, mittel- oder langfristig – wir finden die passenden Anlageformen, um Ihr Vermögen systematisch und rentabel zu vermehren.
                    </ServiceCard>
                    <ServiceCard icon="👴" title="Altersvorsorge">
                        Sorgen Sie für einen entspannten Ruhestand. Ich zeige Ihnen, wie Sie Versorgungslücken schließen und Ihren Lebensstandard im Alter sichern.
                    </ServiceCard>
                    <ServiceCard icon="🏠" title="Immobilien & Finanzierung">
                        Der Traum vom Eigenheim oder einer Kapitalanlage? Ich begleite Sie von der Finanzierungsplanung bis zur Schlüsselübergabe.
                    </ServiceCard>
                    <ServiceCard icon="🛡️" title="Absicherung & Schutz">
                        Schützen Sie sich und Ihre Familie vor den finanziellen Folgen unerwarteter Ereignisse. Wir prüfen Ihren Bedarf an wichtigen Versicherungen.
                    </ServiceCard>
                    <ServiceCard icon="💼" title="Unternehmensberatung">
                        Auch für Selbstständige und Unternehmer biete ich maßgeschneiderte Konzepte zur Optimierung der betrieblichen und privaten Finanzen.
                    </ServiceCard>
                    <ServiceCard icon="📈" title="Staatliche Förderungen">
                        Profitieren Sie von staatlichen Zuschüssen und Steuervorteilen. Ich helfe Ihnen, alle Ihnen zustehenden Förderungen voll auszuschöpfen.
                    </ServiceCard>
                </div>
            </Card>

            <Card className="text-center bg-gradient-to-r from-blue-600 to-slate-800 text-white shadow-2xl">
                <h2 className="text-3xl font-bold font-montserrat mb-4 drop-shadow-lg">Bereit für den nächsten Schritt?</h2>
                <p className="text-blue-100 max-w-2xl mx-auto mb-6">
                    Lassen Sie uns in einem unverbindlichen Gespräch herausfinden, wie ich Sie auf Ihrem Weg zu finanziellem Erfolg begleiten kann. Ich freue mich darauf, Sie kennenzulernen!
                </p>
                <Button variant="accent" onClick={() => navigate('/booking')}>
                    Jetzt kostenlosen Termin vereinbaren
                </Button>
            </Card>
        </div>
    );
};