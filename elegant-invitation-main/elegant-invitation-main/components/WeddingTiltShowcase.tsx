"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";

/**
 * WeddingTiltShowcase
 * React Bits inspired (TiltedCard + GlareHover + Sparkles) animation for ONE image.
 * - 3D mouse / touch tilt with smooth spring-like easing
 * - Moving glare that follows the pointer
 * - Rotating gold conic ring + dashed mandala ring behind the card
 * - Temple-arch (mandap) shaped frame
 * - Floating petals, twinkling sparkles & hearts
 * - Slow Ken Burns zoom + periodic gold shine sweep
 * - Names & date float in 3D above the photo
 */

type Props = {
    src: string;
    alt?: string;
    names?: string;
    date?: string;
    caption?: string;
    petalSrc?: string;
    daisySrc?: string;
    onClick?: (src: string) => void;
};

const SPARKLES = [
    { top: "4%", left: "10%", size: 14, delay: 0 },
    { top: "12%", left: "88%", size: 18, delay: 0.8 },
    { top: "28%", left: "-4%", size: 12, delay: 1.6 },
    { top: "36%", left: "103%", size: 14, delay: 0.4 },
    { top: "55%", left: "-6%", size: 18, delay: 1.2 },
    { top: "62%", left: "101%", size: 12, delay: 2.0 },
    { top: "80%", left: "6%", size: 14, delay: 0.6 },
    { top: "88%", left: "94%", size: 16, delay: 1.4 },
    { top: "-3%", left: "50%", size: 16, delay: 1.0 },
    { top: "102%", left: "48%", size: 12, delay: 1.8 },
];

const PETALS = [
    { left: "8%", dur: 9, delay: 0, size: 22, kind: "petal" },
    { left: "24%", dur: 12, delay: 3, size: 18, kind: "daisy" },
    { left: "42%", dur: 10, delay: 6, size: 24, kind: "petal" },
    { left: "60%", dur: 13, delay: 1.5, size: 18, kind: "daisy" },
    { left: "78%", dur: 11, delay: 4.5, size: 22, kind: "petal" },
    { left: "92%", dur: 14, delay: 7.5, size: 18, kind: "daisy" },
];

export default function WeddingTiltShowcase({
    src,
    alt = "Wedding couple",
    names = "Mithilesh & Keerthana",
    date = "1st November 2026",
    caption = "Together Forever",
    petalSrc,
    daisySrc,
    onClick,
}: Props) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const glareRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number | null>(null);
    const target = useRef({ rx: 0, ry: 0, gx: 50, gy: 50, glare: 0 });
    const current = useRef({ rx: 0, ry: 0, gx: 50, gy: 50, glare: 0 });
    const [visible, setVisible] = useState(false);

    /* entrance when scrolled into view */
    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) {
                    setVisible(true);
                    io.disconnect();
                }
            },
            { threshold: 0.2 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    /* smooth animation loop (lerp = spring feel) */
    useEffect(() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const loop = () => {
            const c = current.current;
            const t = target.current;
            const k = reduce ? 1 : 0.12;
            c.rx += (t.rx - c.rx) * k;
            c.ry += (t.ry - c.ry) * k;
            c.gx += (t.gx - c.gx) * k;
            c.gy += (t.gy - c.gy) * k;
            c.glare += (t.glare - c.glare) * k;

            if (cardRef.current) {
                cardRef.current.style.transform = `rotateX(${c.rx.toFixed(2)}deg) rotateY(${c.ry.toFixed(2)}deg)`;
            }
            if (glareRef.current) {
                glareRef.current.style.opacity = String(c.glare);
                glareRef.current.style.background = `radial-gradient(circle at ${c.gx}% ${c.gy}%, rgba(255,248,220,0.85) 0%, rgba(255,230,160,0.35) 28%, transparent 60%)`;
            }
            rafRef.current = requestAnimationFrame(loop);
        };
        rafRef.current = requestAnimationFrame(loop);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    const handleMove = (clientX: number, clientY: number) => {
        const el = cardRef.current?.parentElement;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const px = (clientX - r.left) / r.width;
        const py = (clientY - r.top) / r.height;
        const max = 14;
        target.current = {
            rx: (0.5 - py) * 2 * max,
            ry: (px - 0.5) * 2 * max,
            gx: px * 100,
            gy: py * 100,
            glare: 0.75,
        };
    };

    const handleLeave = () => {
        target.current = { rx: 0, ry: 0, gx: 50, gy: 50, glare: 0 };
    };

    return (
        <div
            ref={wrapRef}
            className={`wts-root ${visible ? "wts-visible" : ""}`}
            onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
            onMouseLeave={handleLeave}
            onTouchMove={(e) => {
                const t = e.touches[0];
                if (t) handleMove(t.clientX, t.clientY);
            }}
            onTouchStart={(e) => {
                const t = e.touches[0];
                if (t) handleMove(t.clientX, t.clientY);
            }}
            onTouchEnd={handleLeave}
        >
            <style>{`
                .wts-root {
                    position: relative;
                    width: min(84vw, 360px);
                    margin: 0 auto;
                    perspective: 1100px;
                    opacity: 0;
                    transform: translateY(50px) scale(0.92);
                    filter: blur(8px);
                    transition: opacity 1.1s cubic-bezier(.22,1,.36,1),
                                transform 1.1s cubic-bezier(.22,1,.36,1),
                                filter 1.1s ease;
                    -webkit-tap-highlight-color: transparent;
                }
                .wts-root.wts-visible {
                    opacity: 1;
                    transform: none;
                    filter: none;
                }

                /* gentle idle float so it feels alive even without hover (mobile) */
                .wts-float {
                    position: relative;
                    animation: wtsFloat 6s ease-in-out infinite;
                }
                @keyframes wtsFloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }

                /* soft golden aura */
                .wts-aura {
                    position: absolute;
                    inset: -12%;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(212,175,55,0.38) 0%, rgba(182,32,57,0.14) 45%, transparent 70%);
                    filter: blur(30px);
                    animation: wtsAura 5s ease-in-out infinite alternate;
                    pointer-events: none;
                }
                @keyframes wtsAura {
                    from { transform: scale(0.92); opacity: 0.7; }
                    to { transform: scale(1.08); opacity: 1; }
                }

                /* dashed mandala ring rotating behind */
                .wts-mandala {
                    position: absolute;
                    left: 50%; top: 50%;
                    width: 128%; aspect-ratio: 1;
                    margin-left: -64%;
                    margin-top: -64%;
                    border-radius: 50%;
                    border: 1.5px dashed rgba(184,134,11,0.55);
                    animation: wtsSpin 40s linear infinite;
                    pointer-events: none;
                }
                .wts-mandala::before {
                    content: "";
                    position: absolute; inset: 6%;
                    border-radius: 50%;
                    border: 1px dotted rgba(182,32,57,0.45);
                    animation: wtsSpin 28s linear infinite reverse;
                }
                @keyframes wtsSpin { to { transform: rotate(360deg); } }

                /* tilt card */
                .wts-card {
                    position: relative;
                    transform-style: preserve-3d;
                    will-change: transform;
                    cursor: ${onClick ? "zoom-in" : "default"};
                }

                /* refined double-line frame */
                .wts-ring {
                    position: relative;
                    padding: 7px;
                    border: 1px solid rgba(184,134,11,0.72);
                    border-radius: 30px;
                    background: linear-gradient(145deg, #fff8e8 0%, #d4af37 48%, #9a6f0a 100%);
                    box-shadow:
                        0 22px 42px rgba(76,5,25,0.24),
                        0 8px 18px rgba(122,45,45,0.14),
                        0 0 0 1px rgba(255,248,220,0.75);
                }
                .wts-ring::before {
                    content: "";
                    position: absolute;
                    inset: 3px;
                    border: 1px solid rgba(76,5,25,0.34);
                    border-radius: 25px;
                    pointer-events: none;
                }

                .wts-inner {
                    position: relative;
                    overflow: hidden;
                    aspect-ratio: 2 / 3;
                    border: 4px solid #fff8e8;
                    border-radius: 24px;
                    background: #4c0519;
                    box-shadow: inset 0 0 0 1px rgba(121,21,38,0.35);
                }
                .wts-img {
                    width: 100%; height: 100%;
                    object-fit: cover;
                    object-position: center 30%;
                    display: block;
                    animation: wtsKenBurns 14s ease-in-out infinite alternate;
                    transform-origin: 50% 35%;
                }
                @keyframes wtsKenBurns {
                    from { transform: scale(1.02); }
                    to { transform: scale(1.12); }
                }

                .wts-glare {
                    position: absolute; inset: 0;
                    opacity: 0;
                    mix-blend-mode: soft-light;
                    pointer-events: none;
                }

                /* periodic gold shine sweep */
                .wts-shine {
                    position: absolute; inset: 0;
                    background: linear-gradient(115deg, transparent 35%, rgba(255,240,190,0.55) 50%, transparent 65%);
                    transform: translateX(-120%);
                    animation: wtsShine 5.5s ease-in-out infinite;
                    pointer-events: none;
                }
                @keyframes wtsShine {
                    0%, 55% { transform: translateX(-120%); }
                    85%, 100% { transform: translateX(120%); }
                }

                /* bottom fade for text legibility */
                .wts-fade {
                    position: absolute; left: 0; right: 0; bottom: 0; height: 38%;
                    background: linear-gradient(to top, rgba(60,5,20,0.82), rgba(60,5,20,0.35) 55%, transparent);
                    pointer-events: none;
                }

                /* floating text (pops out in 3D) */
                .wts-text {
                    position: absolute; left: 0; right: 0; bottom: 5%;
                    text-align: center;
                    transform: translateZ(55px);
                    color: #fff8f0;
                    text-shadow: 0 2px 12px rgba(0,0,0,0.6);
                    pointer-events: none;
                    padding: 0 12px;
                }
                .wts-cap {
                    font-family: 'Cinzel', serif;
                    font-size: 0.62rem;
                    letter-spacing: 0.35em;
                    text-transform: uppercase;
                    color: #f6e7b0;
                }
                .wts-names {
                    font-family: 'Runethia', 'Candlescript', 'Great Vibes', cursive;
                    font-size: clamp(1.9rem, 8vw, 2.5rem);
                    line-height: 1.1;
                    margin-top: 4px;
                }
                .wts-date {
                    font-family: 'Cinzel', serif;
                    font-size: 0.7rem;
                    letter-spacing: 0.22em;
                    text-transform: uppercase;
                    margin-top: 6px;
                    color: #fbe9b5;
                }

                /* corner ornaments on the frame */
                .wts-corner {
                    position: absolute;
                    font-size: 1.4rem;
                    transform: translateZ(40px);
                    filter: drop-shadow(0 3px 6px rgba(0,0,0,0.35));
                    animation: wtsBob 3.5s ease-in-out infinite;
                    pointer-events: none;
                }
                @keyframes wtsBob {
                    0%, 100% { transform: translateZ(40px) translateY(0) rotate(-6deg); }
                    50% { transform: translateZ(40px) translateY(-6px) rotate(6deg); }
                }

                /* sparkles */
                .wts-spark {
                    position: absolute;
                    color: #d4af37;
                    line-height: 1;
                    animation: wtsTwinkle 2.8s ease-in-out infinite;
                    pointer-events: none;
                    text-shadow: 0 0 10px rgba(212,175,55,0.9);
                }
                @keyframes wtsTwinkle {
                    0%, 100% { transform: scale(0.3) rotate(0deg); opacity: 0.2; }
                    50% { transform: scale(1.15) rotate(45deg); opacity: 1; }
                }

                /* rising petals */
                .wts-petal {
                    position: absolute;
                    bottom: -6%;
                    opacity: 0;
                    animation: wtsRise linear infinite;
                    pointer-events: none;
                }
                @keyframes wtsRise {
                    0%   { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
                    12%  { opacity: 0.9; }
                    85%  { opacity: 0.9; }
                    100% { transform: translateY(-115%) translateX(26px) rotate(300deg); opacity: 0; }
                }

                /* floating hearts */
                .wts-heart {
                    position: absolute;
                    color: #b62039;
                    opacity: 0;
                    animation: wtsHeart 6s ease-in infinite;
                    pointer-events: none;
                }
                @keyframes wtsHeart {
                    0%   { transform: translateY(0) scale(0.6); opacity: 0; }
                    20%  { opacity: 0.85; }
                    100% { transform: translateY(-140px) scale(1.2); opacity: 0; }
                }

                @media (prefers-reduced-motion: reduce) {
                    .wts-float, .wts-aura, .wts-mandala, .wts-mandala::before,
                    .wts-ring, .wts-img, .wts-shine, .wts-corner, .wts-spark,
                    .wts-petal, .wts-heart { animation: none !important; }
                    .wts-root { transition: none; opacity: 1; transform: none; filter: none; }
                }
            `}</style>

            <div className="wts-float">
                <div className="wts-aura" />
                <div className="wts-mandala" />

                {/* sparkles around the frame */}
                {SPARKLES.map((s, i) => (
                    <span
                        key={i}
                        className="wts-spark"
                        style={{
                            top: s.top,
                            left: s.left,
                            fontSize: s.size,
                            animationDelay: `${s.delay}s`,
                        }}
                    >
                        ✦
                    </span>
                ))}

                {/* petals rising across the card */}
                {petalSrc &&
                    daisySrc &&
                    PETALS.map((p, i) => (
                        <img
                            key={i}
                            src={p.kind === "petal" ? petalSrc : daisySrc}
                            alt=""
                            className="wts-petal"
                            style={{
                                left: p.left,
                                width: p.size,
                                animationDuration: `${p.dur}s`,
                                animationDelay: `${p.delay}s`,
                                zIndex: 5,
                            }}
                        />
                    ))}

                {/* hearts */}
                {[
                    { left: "30%", delay: 0 },
                    { left: "52%", delay: 2 },
                    { left: "70%", delay: 4 },
                ].map((h, i) => (
                    <span
                        key={i}
                        className="wts-heart"
                        style={{ left: h.left, bottom: "14%", animationDelay: `${h.delay}s`, fontSize: 16, zIndex: 6 }}
                    >
                        ♥
                    </span>
                ))}

                {/* 3D tilt card */}
                <div
                    ref={cardRef}
                    className="wts-card"
                    onClick={() => onClick?.(src)}
                    role={onClick ? "button" : undefined}
                    aria-label={onClick ? "View photo full screen" : undefined}
                >
                    <div className="wts-ring">
                        <div className="wts-inner">
                            <img src={src} alt={alt} className="wts-img" draggable={false} />
                            <div className="wts-fade" />
                            <div ref={glareRef} className="wts-glare" />
                            <div className="wts-shine" />
                        </div>
                    </div>

                    <span className="wts-corner" style={{ top: "-2%", left: "-5%" }}>🪷</span>
                    <span className="wts-corner" style={{ top: "-2%", right: "-5%", animationDelay: "0.8s" }}>🌸</span>
                    <span className="wts-corner" style={{ bottom: "20%", left: "-7%", animationDelay: "1.6s" }}>🌼</span>
                    <span className="wts-corner" style={{ bottom: "20%", right: "-7%", animationDelay: "2.2s" }}>🌿</span>

                    <div className="wts-text">
                        <div className="wts-cap">{caption}</div>
                        <div className="wts-names">{names}</div>
                        <div className="wts-date">{date}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}