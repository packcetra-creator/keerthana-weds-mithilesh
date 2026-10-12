"use client";

/* eslint-disable @next/next/no-img-element */
import "./template1.css";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import confetti from "canvas-confetti";
import WeddingTiltShowcase from "@/components/WeddingTiltShowcase";

/* ------------------------------------------------------------------ */
/* Assets Configuration                                                */
/* ------------------------------------------------------------------ */
const BASE = "https://framika-wedding.pages.dev/template1/assets/images";
const IMG = {
    petal: `${BASE}/falling-rose-petal-CzrX2ZBd.png`,
    daisy: `${BASE}/falling-daisy-DWyrh5i3.png`,
    envelope: `${BASE}/envelope_burgundy.png`,
    seal: `${BASE}/wax_seal_gold.png`,
    mainBg: `${BASE}/mainbg-C1qdEah8.jpg`,
    ganesh: `${BASE}/ganesh-idol-TubyYjSJ.png`,
};

const WEDDING_DATE = new Date("2026-11-01T00:00:00");
const VENUE = "Ramalaya Kalyana Mandabam";
const MAP_LINK = "https://maps.app.goo.gl/keWKBTp1qyquWyvw5";
const MAP_EMBED =
    "https://www.google.com/maps?q=Ramalaya+Kalyana+Mandapam%2C+13.0765364%2C+80.124949&output=embed";

const EVENTS = [
    {
        title: "Wedding",
        desc: "The beautiful exchange of garlands and wedding rituals",
        dateOffset: 0,
        time: "06:00 AM onwards",
        bg: `${BASE}/wed-BZo2ZNd6.png`,
        art: "/South Indian Wedding Couple Cutout.png",
        alt: "Varmala & Phere couple illustration",
    },
    {
        title: "Reception",
        desc: "A grand evening to celebrate the happy couple with loved ones",
        dateOffset: 0,
        date: new Date("2026-10-31T00:00:00"),
        time: "06:30 PM onwards",
        bg: `${BASE}/recept-CMr8tXBs.jpg`,
        art: "/Elegant South Asian Wedding Pose.png",
        alt: "Reception couple illustration",
    },
];

const GALLERY_IMAGE = "/couple.jpg";

const CONTACTS = [
    { label: "Family Contact 1", number: "+91 98765 43210", tel: "+919876543210" },
    { label: "Family Contact 2", number: "+91 98765 43211", tel: "+919876543211" },
];

function addDays(date: Date, days: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function formatScheduleDate(date: Date) {
    return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
    }).replace(",", " ·");
}

function getOrdinalSuffix(day: number) {
    if (day % 100 >= 11 && day % 100 <= 13) return "th";
    return day % 10 === 1 ? "st" : day % 10 === 2 ? "nd" : day % 10 === 3 ? "rd" : "th";
}

function WeddingDate({ date }: { date: Date }) {
    const day = date.getDate();
    const suffix = getOrdinalSuffix(day);
    const month = date.toLocaleDateString("en-US", { month: "long" }).toUpperCase();
    const year = date.getFullYear();

    return (
        <>
            {day}
            <sup className="relative -top-[0.35em] ml-0.5 text-[0.55em] tracking-normal">{suffix}</sup>{" "}
            {month} {year}
        </>
    );
}

/* ── Web Audio API Romantic Crystalline Harp Chime ── */
function playRomanticChime() {
    try {
        const AudioContextClass =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextClass) return;
        const ctx = new AudioContextClass();
        const freqs = [587.33, 739.99, 880.0, 1174.66, 1479.98];
        const now = ctx.currentTime;

        freqs.forEach((freq, index) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, now + index * 0.07);

            gain.gain.setValueAtTime(0.001, now + index * 0.07);
            gain.gain.exponentialRampToValueAtTime(0.2, now + index * 0.07 + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.07 + 1.6);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + index * 0.07);
            osc.stop(now + index * 0.07 + 1.8);
        });
    } catch (e) {
        console.log("Audio chime playback:", e);
    }
}

/* ------------------------------------------------------------------ */
/* Interactive Scratch Card Component (Image 4 & 5)                    */
/* ------------------------------------------------------------------ */
function ScratchCard({
    isRevealed,
    onScratchTrigger,
    weddingDate,
}: {
    isRevealed: boolean;
    onScratchTrigger: () => void;
    weddingDate: Date;
}) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const isDrawingRef = useRef(false);
    const lastPosRef = useRef<{ x: number; y: number } | null>(null);
    const scratchCountRef = useRef(0);
    const triggeredRef = useRef(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const parent = canvas.parentElement;
        if (!parent) return;

        const paintCanvas = () => {
            const rect = parent.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            const width = rect.width || 448;
            const height = rect.height || 128;

            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const grad = ctx.createLinearGradient(0, 0, width, height);
            grad.addColorStop(0, "#d4af37");
            grad.addColorStop(0.2, "#f4e7b8");
            grad.addColorStop(0.45, "#c59b27");
            grad.addColorStop(0.75, "#edd186");
            grad.addColorStop(1, "#a87a12");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
            for (let i = 0; i < 45; i++) {
                const rx = Math.random() * width;
                const ry = Math.random() * height;
                const rsize = Math.random() * 2 + 1;
                ctx.fillRect(rx, ry, rsize, rsize);
            }

            ctx.strokeStyle = "rgba(122, 45, 45, 0.35)";
            ctx.lineWidth = 1.2;
            ctx.strokeRect(10, 10, width - 20, height - 20);

            ctx.font = "600 13px Cinzel, serif";
            ctx.fillStyle = "#6b2020";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("✦ SCRATCH TO REVEAL ✦", width / 2, height / 2 - 7);

            ctx.font = 'italic 12px "Cormorant Garamond", Georgia, serif';
            ctx.fillStyle = "#7a2d2d";
            ctx.fillText("Tap or drag to reveal the date", width / 2, height / 2 + 13);
        };

        paintCanvas();
        const observer = new ResizeObserver(paintCanvas);
        observer.observe(parent);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (isRevealed && canvasRef.current) {
            canvasRef.current.style.transition = "opacity 0.6s ease";
            canvasRef.current.style.opacity = "0";
            setTimeout(() => {
                if (canvasRef.current) canvasRef.current.style.display = "none";
            }, 600);
        }
    }, [isRevealed]);

    const getPos = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        if ("touches" in e && e.touches.length > 0) {
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top,
            };
        }
        const mouseEvent = e as React.MouseEvent;
        return {
            x: mouseEvent.clientX - rect.left,
            y: mouseEvent.clientY - rect.top,
        };
    };

    const scratch = (x: number, y: number) => {
        if (triggeredRef.current) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(x, y, 22, 0, Math.PI * 2);
        ctx.fill();

        if (lastPosRef.current) {
            ctx.beginPath();
            ctx.lineWidth = 44;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    };

    const checkScratchedPercentage = (forceCheck = false) => {
        if (triggeredRef.current) return;
        scratchCountRef.current++;
        if (!forceCheck && scratchCountRef.current % 4 !== 0) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        try {
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imgData.data;
            const total = pixels.length / 4;
            let cleared = 0;
            for (let i = 3; i < pixels.length; i += 32) {
                if (pixels[i] === 0) cleared++;
            }
            const percent = cleared / (total / 8);
            // Require substantial scratching (35%) to give user time to scratch before reveal
            if (percent > 0.35 || (forceCheck && percent > 0.20)) {
                setTimeout(() => {
                    triggerModal();
                }, 350);
            }
        } catch {
            if (scratchCountRef.current > 30) {
                setTimeout(() => {
                    triggerModal();
                }, 350);
            }
        }
    };

    const triggerModal = () => {
        if (triggeredRef.current) return;
        triggeredRef.current = true;
        onScratchTrigger();
    };

    return (
        <div className="scratch-card relative mx-auto w-full max-w-[460px] h-32 rounded-2xl overflow-hidden border border-[#d4af37]/45 shadow-[0_8px_24px_rgba(122,45,45,0.08),0_2px_6px_rgba(0,0,0,0.04)] select-none bg-[#FAF7F2]">
            {/* Revealed Luxury Card Underneath (Matching Image 5) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FAF7F2] px-4 text-center rounded-2xl">
                <p className="font-cinzel text-xs sm:text-sm font-normal tracking-[0.35em] text-[#8a5a42] uppercase">
                    SAVE THE DATE
                </p>
                <p className="font-cinzel text-2xl sm:text-3xl font-medium tracking-[0.18em] text-[#791526] mt-1.5 uppercase">
                    <WeddingDate date={weddingDate} />
                </p>
            </div>

            {/* Gold Scratchable Canvas (Image 1) */}
            <canvas
                ref={canvasRef}
                onMouseDown={(e) => {
                    isDrawingRef.current = true;
                    const pos = getPos(e);
                    lastPosRef.current = pos;
                    scratch(pos.x, pos.y);
                }}
                onMouseMove={(e) => {
                    if (!isDrawingRef.current) return;
                    const pos = getPos(e);
                    scratch(pos.x, pos.y);
                    lastPosRef.current = pos;
                    checkScratchedPercentage();
                }}
                onMouseUp={() => {
                    isDrawingRef.current = false;
                    lastPosRef.current = null;
                    checkScratchedPercentage(true);
                }}
                onTouchStart={(e) => {
                    isDrawingRef.current = true;
                    const pos = getPos(e);
                    lastPosRef.current = pos;
                    scratch(pos.x, pos.y);
                }}
                onTouchMove={(e) => {
                    if (!isDrawingRef.current) return;
                    const pos = getPos(e);
                    scratch(pos.x, pos.y);
                    lastPosRef.current = pos;
                    checkScratchedPercentage();
                }}
                onTouchEnd={() => {
                    isDrawingRef.current = false;
                    lastPosRef.current = null;
                    checkScratchedPercentage(true);
                }}
                className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing touch-none z-10"
            />
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Helpers & Micro-Components                                          */
/* ------------------------------------------------------------------ */
const AMBIENT_PETALS = [
    { left: 6, dur: 14, delay: 0, src: IMG.petal, size: 28 },
    { left: 20, dur: 18, delay: 2, src: IMG.daisy, size: 22 },
    { left: 38, dur: 12, delay: 4, src: IMG.petal, size: 32 },
    { left: 58, dur: 16, delay: 1, src: IMG.daisy, size: 24 },
    { left: 72, dur: 13, delay: 6, src: IMG.petal, size: 28 },
    { left: 87, dur: 19, delay: 3, src: IMG.daisy, size: 22 },
];

function AmbientPetals() {
    const petals = AMBIENT_PETALS;

    return (
        <>
            {petals.map((p, i) => (
                <div
                    key={i}
                    className="petal-item"
                    style={{
                        left: `${p.left}%`,
                        animationDuration: `${p.dur}s`,
                        animationDelay: `${p.delay}s`,
                    }}
                >
                    <img
                        src={p.src}
                        alt=""
                        style={{ width: p.size, height: "auto", objectFit: "contain" }}
                    />
                </div>
            ))}
        </>
    );
}

function ContinuousInsidePetals() {
    const petals = [
        { left: 3, dur: 14, delay: 0, src: IMG.petal, size: 32 },
        { left: 12, dur: 19, delay: 4, src: IMG.daisy, size: 24 },
        { left: 22, dur: 16, delay: 1, src: IMG.petal, size: 28 },
        { left: 32, dur: 22, delay: 7, src: IMG.daisy, size: 22 },
        { left: 42, dur: 15, delay: 3, src: IMG.petal, size: 34 },
        { left: 52, dur: 21, delay: 9, src: IMG.daisy, size: 26 },
        { left: 63, dur: 17, delay: 2, src: IMG.petal, size: 30 },
        { left: 74, dur: 23, delay: 8, src: IMG.daisy, size: 25 },
        { left: 84, dur: 15, delay: 5, src: IMG.petal, size: 35 },
        { left: 93, dur: 18, delay: 11, src: IMG.daisy, size: 23 },
        { left: 7, dur: 24, delay: 12, src: IMG.daisy, size: 26 },
        { left: 27, dur: 18, delay: 10, src: IMG.petal, size: 32 },
        { left: 48, dur: 20, delay: 14, src: IMG.daisy, size: 24 },
        { left: 68, dur: 16, delay: 6, src: IMG.petal, size: 30 },
        { left: 88, dur: 22, delay: 13, src: IMG.petal, size: 28 },
    ];

    return (
        <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden" aria-hidden="true">
            {petals.map((p, i) => (
                <div
                    key={i}
                    className="inside-petal"
                    style={{
                        left: `${p.left}%`,
                        animationDuration: `${p.dur}s`,
                        animationDelay: `${p.delay}s`,
                    }}
                >
                    <img
                        src={p.src}
                        alt=""
                        style={{ width: p.size, height: "auto", objectFit: "contain" }}
                    />
                </div>
            ))}
        </div>
    );
}

function Reveal({
    children,
    className = "",
    delay = 0,
}: {
    children: ReactNode;
    className?: string;
    delay?: number;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [shown, setShown] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) {
                    setShown(true);
                    io.disconnect();
                }
            },
            { threshold: 0.15 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);
    return (
        <div
            ref={ref}
            className={`reveal ${shown ? "reveal-in" : ""} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

const Leaves = () => (
    <div className="my-6 text-center text-2xl tracking-[0.4em] opacity-40">🌿🌸🌼🌿</div>
);
const Flower = () => (
    <div className="my-5 flex items-center justify-center gap-3">
        <span className="h-px w-16 bg-[#c59b27]/60"></span>
        <span className="text-lg text-[#c59b27]">❀</span>
        <span className="h-px w-16 bg-[#c59b27]/60"></span>
    </div>
);

function useCountdown(target: Date) {
    const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
    useEffect(() => {
        const tick = () => {
            const diff = Math.max(0, target.getTime() - Date.now());
            setT({
                d: Math.floor(diff / 86400000),
                h: Math.floor((diff / 3600000) % 24),
                m: Math.floor((diff / 60000) % 60),
                s: Math.floor((diff / 1000) % 60),
            });
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [target]);
    return t;
}

const pad = (n: number) => String(n).padStart(2, "0");

/* ------------------------------------------------------------------ */
/* Page Component                                                      */
/* ------------------------------------------------------------------ */
export default function Template1() {
    const [stage, setStage] = useState<"envelope" | "opening" | "main">("envelope");
    const [showFlyerModal, setShowFlyerModal] = useState(false);
    const [isScratchRevealed, setIsScratchRevealed] = useState(false);
    const [lightbox, setLightbox] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const cd = useCountdown(WEDDING_DATE);
    const mounted = useSyncExternalStore(
        () => () => {},
        () => true,
        () => false
    );

    // 1. Initial Envelope Click -> Directly Opens Main Page (No popup)
    const handleOpenEnvelope = () => {
        if (stage !== "envelope") return;
        setStage("opening");

        playRomanticChime();

        try {
            confetti({
                particleCount: 120,
                spread: 90,
                origin: { y: 0.5 },
                colors: ["#D4AF37", "#F6E7B0", "#7a2d2d", "#963737", "#FFFFFF", "#c9996e"],
                ticks: 260,
                gravity: 0.9,
            });
        } catch {
            // ignore
        }

        setTimeout(() => {
            setStage("main");
            audioRef.current?.play().catch(() => { });
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 550);
    };

    // 2. Triggered when user scratches the Gold Card
    const handleScratchTrigger = () => {
        try {
            confetti({
                particleCount: 110,
                spread: 85,
                origin: { y: 0.6 },
                colors: ["#D4AF37", "#F6E7B0", "#7a2d2d", "#FFFFFF"],
                ticks: 240,
                gravity: 0.85,
            });
        } catch {
            // ignore
        }

        setShowFlyerModal(true);
    };

    // 3. Clicked "Explore Invitation" inside the Scratch Card Flyer Modal
    const handleExploreFromModal = () => {
        confetti.reset();
        setShowFlyerModal(false);
        setIsScratchRevealed(true);
    };

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow =
            stage === "main" && !showFlyerModal ? "" : "hidden";
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [stage, showFlyerModal]);

    useEffect(() => {
        return () => {
            confetti.reset();
        };
    }, []);

    return (
        <div className="relative min-h-screen text-[#4a1c24] font-serif-display">
            <audio ref={audioRef} src="/wedding-song.mp3" loop preload="none" />

            {/* ══════════════════════════════════════════════
           PART 1 — LUXURY MAROON ENVELOPE OPENING SCREEN
         ══════════════════════════════════════════════ */}
            {(stage === "envelope" || stage === "opening") && (
                <section
                    id="part1-screen"
                    className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden px-4 py-6 transition-all duration-700 ${stage === "opening" ? "scale-105 opacity-0 delay-300 pointer-events-none" : "opacity-100"
                        }`}
                    style={{
                        background: "linear-gradient(180deg, #fff7f7 0%, #fee2e2 50%, #fde2e4 100%)",
                    }}
                >
                    {/* Ambient Glow Background Pulse */}
                    <div
                        className="pointer-events-none absolute h-[650px] w-[650px] rounded-full sm:h-[750px] sm:w-[750px]"
                        style={{
                            background:
                                "radial-gradient(circle, rgba(254, 205, 211, 0.65) 0%, rgba(255, 228, 230, 0.35) 50%, transparent 75%)",
                            filter: "blur(60px)",
                            animation: "ambientPulse 6s infinite alternate ease-in-out",
                        }}
                    />

                    {/* Decorative Corner Floating Icons */}
                    <span className="pointer-events-none absolute left-6 top-6 animate-drift text-3xl opacity-70">
                        🪷
                    </span>
                    <span
                        className="pointer-events-none absolute right-8 top-8 animate-drift text-2xl opacity-60"
                        style={{ animationDelay: "1s" }}
                    >
                        🌸
                    </span>
                    <span
                        className="pointer-events-none absolute bottom-8 left-8 animate-drift text-3xl opacity-70"
                        style={{ animationDelay: "2s" }}
                    >
                        🌿
                    </span>
                    <span
                        className="pointer-events-none absolute bottom-6 right-6 animate-drift text-3xl opacity-70"
                        style={{ animationDelay: "0.5s" }}
                    >
                        🍃
                    </span>

                    {/* Floating Ambient Petals */}
                    <AmbientPetals />

                    {/* Envelope Container */}
                    <div className="relative z-10 flex w-full max-w-[520px] flex-col items-center justify-center text-center">
                        <button
                            id="open-envelope-btn"
                            type="button"
                            onClick={handleOpenEnvelope}
                            aria-label="Open wedding invitation"
                            className={`image-envelope-btn ${stage === "opening" ? "opening" : ""}`}
                        >
                            <img
                                src={IMG.envelope}
                                alt="Wedding invitation envelope"
                                className="image-envelope-img"
                            />
                            <span className="image-envelope-seal">
                                <span className="relative flex items-center justify-center">
                                    <img
                                        src={IMG.seal}
                                        alt="Gold Wax Seal"
                                        className="image-envelope-monogram"
                                    />
                                    <span className="seal-ripple"></span>
                                </span>
                            </span>
                        </button>

                        {/* Bottom Text Section */}
                        <div className="envelope-text-wrapper">
                            <h2 className="envelope-title font-script">
                                You&apos;re Invited
                            </h2>
                            <p className="envelope-subtitle font-serif-display">
                                Tap the envelope to open your invitation
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {/* ══════════════════════════════════════════════
           PART 2 — MAIN INVITATION CONTENT
         ══════════════════════════════════════════════ */}
            {stage === "main" && (
                <main className="animate-[fadeIn_0.9s_ease_both] bg-[#fdf6ec]">
                    <ContinuousInsidePetals />

                    {/* Hero Section */}
                    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-15 text-center overflow-hidden">
                        <img
                            src={IMG.mainBg}
                            alt="Khushi and Pranay wedding illustration"
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-[#fdf6ec]/40 via-transparent to-[#fdf6ec]" />

                        <div className="relative z-10 flex flex-col items-center pt-2">
                            <img
                                src={IMG.ganesh}
                                alt="Lord Ganesha"
                                className="ganesh-glow h-24 w-24 object-contain drop-shadow-md sm:h-24 sm:w-24"
                            />
                            <p className="font-serif-display italic font-normal text-xs sm:text-xs mt-2 text-[#791526]">
                                ‖ Shree Ganeshaya Namah ‖</p>
                            <p className="max-w-md font-serif-display font-normal text-base sm:text-lg text-[#791526] mt-4 leading-relaxed">
                                We solicit your gracious presence on the auspicious occasion of
                                <br />
                                the wedding celebration of
                            </p>

                            <h1 className="mt-6 font-script">
                                <span className="block font-script text-5xl sm:text-5xl md:text-8xl text-[#b62039] leading-none">
                                    Keerthana
                                </span>
                            </h1>
                            <p className="mt-3 font-serif-display font-normal text-base sm:text-lg leading-relaxed text-[#4a1c24]/90">
                                D/O
                                <br />
                                Nagarajan
                                <br />
                                &amp; Kavitha
                            </p>

                            <p className="mt-5 font-script text-2xl sm:text-4xl text-[#791526] italic">
                                with
                            </p>

                            <h1 className="mt-2 font-script">
                                <span className="block font-script text-5xl sm:text-5xl md:text-8xl text-[#b62039] leading-none">
                                    Mithilesh
                                </span>
                            </h1>
                            <p className="mt-3 font-serif-display font-normal text-base sm:text-lg leading-relaxed text-[#4a1c24]/90 pb-8">
                                S/O
                                <br />
                                Janarthanan
                                <br />
                                &amp; Prathima
                            </p>
                        </div>
                    </section>

                    {/* ══════════════════════════════════════════════
               SECTION: INTERACTIVE SCRATCH TO REVEAL (Images 4 & 5)
             ══════════════════════════════════════════════ */}
                    <section className="relative bg-[#FAF7F2] px-6 py-10 text-center">
                        <span className="pointer-events-none absolute left-6 top-6 text-3xl opacity-20">🌿</span>
                        <span className="pointer-events-none absolute right-8 top-10 text-3xl opacity-20">🌸</span>
                        <span className="pointer-events-none absolute bottom-8 left-8 text-3xl opacity-20">🌼</span>
                        <span className="pointer-events-none absolute bottom-6 right-6 text-3xl opacity-20">🌿</span>

                        <Reveal>
                            <Flower />

                            {/* Interactive Scratch Card */}
                            <div className="mb-10">
                                <ScratchCard
                                    isRevealed={isScratchRevealed}
                                    onScratchTrigger={handleScratchTrigger}
                                    weddingDate={WEDDING_DATE}
                                />
                            </div>

                            {/* Countdown Timer with smooth slide transition */}
                            <div
                                className={`transition-all duration-700 ${isScratchRevealed
                                    ? "opacity-100 translate-y-0 h-auto mt-8 pointer-events-auto"
                                    : "opacity-0 translate-y-4 pointer-events-none h-0 overflow-hidden"
                                    }`}
                            >
                                <div className="mx-auto grid max-w-[460px] grid-cols-4 gap-3 sm:gap-4">
                                    {[
                                        [cd.d, "DAYS"],
                                        [cd.h, "HOURS"],
                                        [cd.m, "MINUTES"],
                                        [cd.s, "SECONDS"],
                                    ].map(([v, l]) => (
                                        <div
                                            key={l as string}
                                            className="flex flex-col items-center rounded-2xl border border-[#d4af37]/45 bg-[#FAF7F2] py-4 px-1 sm:px-2 shadow-[0_4px_16px_rgba(122,45,45,0.06)]"
                                        >
                                            <div className="font-cinzel text-2xl sm:text-4xl font-normal text-[#791526] tabular-nums tracking-wide">
                                                {pad(v as number)}
                                            </div>
                                            <div className="font-cinzel mt-2 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#8a5a42] font-semibold">
                                                {l}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Flower />
                        </Reveal>
                    </section>

                    {/* Events Schedule Section */}
                    <section className="relative bg-[#4c0519] px-6 py-20 text-[#fff8f0]">
                        <span className="pointer-events-none absolute left-6 top-6 text-3xl opacity-20">🌿</span>
                        <span className="pointer-events-none absolute right-8 top-10 text-3xl opacity-20">🌸</span>

                        <div className="mx-auto max-w-6xl">
                            <Reveal>
                                <div className="text-center mb-14">
                                    <h2 className="font-script text-5xl sm:text-6xl text-[#fff8f0]">
                                        Events Schedule
                                    </h2>
                                    <Flower />
                                </div>
                            </Reveal>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {EVENTS.map((e, i) => {
                                    const artLeft = i % 2 === 0;
                                    return (
                                        <Reveal key={e.title} delay={i % 2 ? 100 : 0}>
                                            <article
                                                className="relative mx-auto flex w-full max-w-[760px] flex-col overflow-hidden rounded-[1.5rem] border border-[#d4af37]/50 shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl sm:block sm:aspect-[700/728]"
                                                style={{ containerType: "inline-size" }}
                                            >
                                                <img src={e.bg} alt="" className="absolute inset-0 h-full w-full object-cover" />
                                                <div
                                                    className="absolute inset-0"
                                                    style={{ backgroundColor: "rgba(0, 0, 0, 0.42)" }}
                                                />

                                                {/* Text block */}
                                                <div
                                                    className={`relative z-10 px-6 pt-10 text-center text-[#fff8f0] sm:absolute sm:top-[11%] sm:w-[44%] sm:px-0 sm:pt-0 ${artLeft ? "sm:right-[5%]" : "sm:left-[5%]"
                                                        }`}
                                                    style={{ textShadow: "0 2px 12px rgba(0,0,0,0.55)" }}
                                                >
                                                    <h3
                                                        className="font-script leading-[1.08] text-[#fff8f0]"
                                                        style={{ fontSize: "clamp(2.75rem, 10cqw, 4.75rem)" }}
                                                    >
                                                        {e.title}
                                                    </h3>
                                                    <p
                                                        className="font-serif-display italic leading-snug text-[#fff8f0]/95"
                                                        style={{ marginTop: "1.6cqw", fontSize: "clamp(1rem, 2.7cqw, 1.35rem)" }}
                                                    >
                                                        {e.desc}
                                                    </p>
                                                    <div
                                                        className="text-[#e8b84a]"
                                                        style={{ margin: "clamp(0.6rem, 2.4cqw, 1.2rem) 0", fontSize: "clamp(0.9rem, 2.2cqw, 1.2rem)" }}
                                                    >
                                                        ❀
                                                    </div>

                                                    {[
                                                        ["Date", formatScheduleDate(e.date ?? addDays(WEDDING_DATE, e.dateOffset)), "clamp(1.15rem, 3.6cqw, 1.7rem)"],
                                                        ["Time", e.time, "clamp(1.15rem, 3.6cqw, 1.7rem)"],
                                                        ["Venue", VENUE, "clamp(1.05rem, 3.4cqw, 1.6rem)"],
                                                    ].map(([label, value, size], idx) => (
                                                        <div key={label} style={{ marginTop: idx === 0 ? 0 : "clamp(0.6rem, 2.6cqw, 1.3rem)" }}>
                                                            <div
                                                                className="font-cinzel text-[#fff8f0]"
                                                                style={{ fontSize: "clamp(0.9rem, 2.3cqw, 1.1rem)" }}
                                                            >
                                                                {label}
                                                            </div>
                                                            <div
                                                                className="font-serif-display leading-tight text-[#fff8f0]"
                                                                style={{ fontSize: size, marginTop: "0.3cqw" }}
                                                            >
                                                                {value}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Couple art */}
                                                <div
                                                    className={`relative z-10 mt-4 h-[300px] w-full pb-4 sm:absolute sm:bottom-[5%] sm:mt-0 sm:h-[60%] sm:w-[46%] sm:pb-0 ${artLeft ? "sm:left-[3%]" : "sm:right-[3%]"
                                                        }`}
                                                >
                                                    <img
                                                        src={e.art}
                                                        alt={e.alt}
                                                        className="h-full w-full object-contain object-bottom drop-shadow-[0_8px_16px_rgba(0,0,0,0.45)]"
                                                    />
                                                </div>
                                            </article>
                                        </Reveal>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* Photo Gallery Section */}
                    <section className="relative bg-[#fdf6ec] px-4 sm:px-6 py-15 text-center overflow-hidden">
                        <Reveal>
                            <span className="font-cinzel text-xs tracking-[0.4em] uppercase text-[#8a5a42]">
                                MOMENTS
                            </span>
                            <h2 className="mt-5 font-script text-5xl sm:text-6xl text-[#791526]">
                                Our Gallery
                            </h2>
                            <div className="my-3 flex items-center justify-center gap-2 text-[#c9996e]">
                                <span>◇</span>
                                <span>◇</span>
                                <span className="text-[#791526] text-base">◆</span>
                                <span>◇</span>
                                <span>◇</span>
                            </div>
                            <p className="mx-auto max-w-md font-serif-display text-base italic text-[#7a503e]">
                                A glimpse into our journey of love and togetherness
                            </p>
                        </Reveal>

                        <div className="my-10 flex justify-center px-4">
    <WeddingTiltShowcase
        src={GALLERY_IMAGE}
        alt="Mithilesh and Keerthana"
        names="Mithilesh & Keerthana"
        date="1st November 2026"
        caption="Together Forever"
        petalSrc={IMG.petal}
        daisySrc={IMG.daisy}
        onClick={(src) => setLightbox(src)}
    />
</div>
                        <Leaves />
                    </section>

                    {/* Awaiting Your Presence */}
                    <section className="relative bg-cream px-6 py-12 text-center">
                        <Reveal>
                            <h2 className="font-script text-4xl sm:text-5xl text-[#791526]">
                                Awaiting Your Noble Presence
                            </h2>
                            <Flower />
                            <p className="mx-auto max-w-md font-serif-display text-lg italic text-[#4a1c24]/90">
                                Because meeting two souls requires twice the fun — and you!
                            </p>
                        </Reveal>
                    </section>

                    {/* With Love - Agrawal Family */}
                    <section className="relative bg-[#4c0519] px-6 py-20 text-[#fff8f0] text-center">
                        <Reveal>
                            <p className="font-cinzel text-xs tracking-widest text-[#fff8f0]">
                                WITH LOVE
                            </p>
                            <h2 className="mt-2 font-script text-4xl sm:text-5xl text-[#fff8f0]">
                                Nagarajan Family
                            </h2>
                            <Flower />
                            <p className="font-serif-display text-base italic text-[#fff8f0]/90">Eagerly waiting for your presence,</p>
                        </Reveal>
                    </section>

                    {/* Venue & Maps Section */}
                    <section className="relative bg-[#fdf6ec] px-6 py-15 text-center">
                        <Reveal>
                            <p className="font-cinzel text-xs tracking-widest text-[#8a5a42]">
                                VENUE
                            </p>
                            <h2 className="mt-2 font-script text-4xl sm:text-5xl text-[#791526]">
                                Where We Celebrate
                            </h2>
                            <Flower />
                            <p className="font-serif-display text-xl font-medium text-[#4a1c24]">{VENUE}</p>

                            <div className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-2xl border border-[#d4af37]/60 shadow-xl">
                                <iframe
                                    src={MAP_EMBED}
                                    title="Venue map"
                                    className="h-[340px] w-full border-0"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    allowFullScreen
                                />
                            </div>

                            <div className="mt-8">
                                <a
                                    href={MAP_LINK}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-cinzel inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#d4af37] to-[#aa7c11] px-8 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all duration-300 hover:scale-105 hover:opacity-95"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                                    </svg>
                                    Get Directions
                                </a>
                            </div>
                        </Reveal>

                        {/* Assistance & Queries Section */}
                        {/* <div className="mx-auto mt-5 max-w-2xl">
                            <Flower />
                            <p className="font-cinzel text-xs uppercase tracking-widest text-[#8a5a42]">
                                FOR ASSISTANCE &amp; QUERIES
                            </p>
                            <h3 className="mt-2 font-script text-3xl sm:text-4xl text-[#791526] mb-8">
                                Contact Family
                            </h3>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                                {CONTACTS.map((c) => (
                                    <a
                                        key={c.tel}
                                        href={`tel:${c.tel}`}
                                        className="flex w-full max-w-[280px] sm:w-auto flex-1 items-center gap-4 rounded-full border border-[#d4af37] bg-white px-6 py-3.5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
                                    >
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7a2d2d] to-[#a83232] text-white shadow-sm transition-transform duration-300 group-hover:scale-110">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2.2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                            </svg>
                                        </div>
                                        <div className="text-left leading-tight">
                                            <span className="font-cinzel block text-[11px] font-semibold uppercase tracking-wider text-[#791526]">
                                                {c.label}
                                            </span>
                                            <span className="block text-sm font-semibold tracking-wide text-[#222222] mt-0.5 font-cinzel">
                                                {c.number}
                                            </span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div> */}
                    </section>

                    {/* Digital Invitation Footer */}
                    <footer className="bg-[#4c0519] px-6 py-8 text-center text-[#fff8f0]">
                        <p className="font-cinzel text-md uppercase tracking-[0.2em] text-[#fbd149]">
                            © Developed by{" "}
                            <a
                                href="https://packcetra.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-colors hover:text-[#fff8f0] underline underline-offset-2"
                            >
                                Packcetra
                            </a>
                        </p>
                        {/* <a
                            href="tel:7305323544"
                            className="mt-3 inline-block font-serif-display text-base italic text-[#fff8f0]/90 transition-colors hover:text-[#d4af37]"
                        >
                            Call - 7305323544 <br /> 
                            If you&apos;re looking for Digital Invitation
                        </a> */}
                    </footer>

                    {/* Floating Wedding Song Player Button */}
                    {/* <button
                        id="music-btn"
                        type="button"
                        onClick={toggleSong}
                        className={`font-cinzel ${playing ? "playing" : ""}`}
                    >
                        <span className="music-icon">🎵</span>
                        <span>Wedding Song {playing ? "· On" : ""}</span>
                    </button> */}
                </main>
            )}

            {/* ══════════════════════════════════════════════
           SCRATCH CARD CRACKLE FLYER MODAL (Image 3)
           Triggered after scratch threshold is reached
         ══════════════════════════════════════════════ */}
            {showFlyerModal && mounted && createPortal(
                <div
                    className="flyer-backdrop show"
                    style={{ zIndex: 2147483647 }}
                    onClick={handleExploreFromModal}
                >
                    <div className="flyer-card" onClick={(e) => e.stopPropagation()}>
                        <div className="flyer-ornament">
                            ✦ SAVE THE DATE ✦
                        </div>

                        <h2 className="flyer-names">
                            <span className="block"> Keerthana &amp;</span>
                            <span className="block">Mithilesh</span>
                        </h2>

                        <div className="flyer-divider" />

                        <div className="flyer-date">
                            <WeddingDate date={WEDDING_DATE} />
                        </div>

                        <p className="flyer-message">
                            We cannot wait to celebrate our special day with you!
                        </p>

                        <div className="flyer-badge">
                            ⏳ {cd.d} DAYS {cd.h} HOURS TO GO!
                        </div>

                        <div>
                            <button
                                type="button"
                                onClick={handleExploreFromModal}
                                className="flyer-btn"
                            >
                                EXPLORE INVITATION 🌸
                            </button>
                        </div>
                    </div>
                </div>
                ,
                document.body
            )}

            {/* Lightbox Modal */}
            {lightbox && (
                <div
                    className="fixed inset-0 z-[99999] flex animate-[fadeIn_0.3s_ease_both] items-center justify-center bg-black/90 p-4"
                    onClick={() => setLightbox(null)}
                >
                    <button
                        type="button"
                        aria-label="Close"
                        className="absolute right-5 top-5 text-4xl text-white hover:text-[#d4af37]"
                        onClick={() => setLightbox(null)}
                    >
                        &times;
                    </button>
                    <img
                        src={lightbox}
                        alt="Full view"
                        className="max-h-[85vh] max-w-full rounded-xl border-2 border-[#d4af37]/60 shadow-2xl object-contain"
                    />
                </div>
            )}
        </div>
    );
}