import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    CloudSun,
    Compass,
    ExternalLink,
    Github,
    Leaf,
    PawPrint,
    Sparkles,
    Waves,
} from "lucide-react";

import whaleCloud from "../assets/whale_cloud.png";
import "../stylesheets/about/ww.about.css";

export default function About() {
    const navigate = useNavigate();

    return (
        <main className="about_page">
            <section className="about_hero">
                <div className="about_hero_copy">
                    <p className="section_eyebrow">About Weather Whale</p>

                    <h1>Weather, translated into atmosphere.</h1>

                    <p>
                        Weather Whale started as a small weather project and has grown into
                        an experiment in making forecasts feel calmer, more useful, and more
                        connected to the rhythm of the day.
                    </p>

                    <div className="about_hero_actions">
                        <button className="ww_primary_btn" type="button" onClick={() => navigate("/search")}>
                            Open forecast
                        </button>

                        <Link className="about_secondary_btn" to="/">
                            Return home
                        </Link>
                    </div>
                </div>

                <div className="about_image_panel">
                    <img src={whaleCloud} alt="A whale-shaped cloud" />
                </div>
            </section>

            <section className="about_grid">
                <article className="about_card about_card_large">
                    <div className="about_icon">
                        <Waves />
                    </div>

                    <h2>Why “Weather Whale”?</h2>

                    <p>
                        The name came from a memory of seeing a cloud shaped like a whale.
                        It felt playful, atmospheric, and a little strange in the right way.
                        The project keeps that spirit: useful weather information, but with
                        more room for feeling, place, and interpretation.
                    </p>
                </article>

                <article className="about_card">
                    <div className="about_icon">
                        <CloudSun />
                    </div>

                    <h2>What it does now</h2>

                    <p>
                        The current forecast dashboard shows local conditions, hourly
                        changes, daily outlook, Pawcast dog-walk comfort, and trend charts
                        without the clutter common in weather apps.
                    </p>
                </article>

                <article className="about_card">
                    <div className="about_icon">
                        <Sparkles />
                    </div>

                    <h2>Where it’s going</h2>

                    <p>
                        The next direction is more ambient: time-of-day states, condition
                        prose, and small activity suggestions shaped by weather, light,
                        wind, and comfort.
                    </p>
                </article>
            </section>

            <section className="about_section about_split">
                <div>
                    <p className="section_eyebrow">Design direction</p>
                    <h2>Less dashboard. More environmental rhythm.</h2>
                </div>

                <div className="about_prose">
                    <p>
                        Weather Whale is moving toward a quieter weather experience: one
                        that helps you understand not just what the forecast says, but what
                        the day might feel like.
                    </p>

                    <p>
                        Instead of overwhelming users with every possible metric at once,
                        the goal is to surface the right details at the right moment — a
                        walk before the wind picks up, open windows after sunset, or a
                        slower indoor evening when conditions turn rough.
                    </p>
                </div>
            </section>

            <section className="about_pillars">
                <article>
                    <Compass />
                    <h3>Oriented by time</h3>
                    <p>Morning, midday, and evening should each feel distinct.</p>
                </article>

                <article>
                    <PawPrint />
                    <h3>Built for real routines</h3>
                    <p>Dog walks, errands, windows open, coffee outside, staying in.</p>
                </article>

                <article>
                    <Leaf />
                    <h3>Calm by default</h3>
                    <p>Weather should inform without feeling noisy or alarmist.</p>
                </article>
            </section>

            <section className="about_section about_conservation">
                <div>
                    <p className="section_eyebrow">A note on whales</p>
                    <h2>The real ones matter, too.</h2>
                </div>

                <p>
                    Since the project borrows the whale for its name, it feels right to
                    mention the real ones. Whales play an important role in ocean health
                    and face threats from climate change, ship traffic, noise, and
                    pollution.
                </p>

                <a
                    href="https://us.whales.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn about Whale and Dolphin Conservation
                    <ExternalLink />
                </a>
            </section>

            <section className="about_section about_changelog">
                <div className="about_section_header">
                    <div>
                        <p className="section_eyebrow">Project notes</p>
                        <h2>Recent direction</h2>
                    </div>

                    <Github aria-hidden="true" />
                </div>

                <div className="about_release_list">
                    <article>
                        <span>Current redesign</span>
                        <h3>Atmospheric dashboard system</h3>
                        <p>
                            New dark/light theme foundation, cinematic forecast dashboard,
                            Pawcast modal, trend visualizations, and refined weather metrics.
                        </p>
                    </article>

                    <article>
                        <span>Next phase</span>
                        <h3>Ambient homepage and state-based experience</h3>
                        <p>
                            Homepage refresh, environmental copy system, time-of-day sections,
                            and eventual motion/scroll-based interactions.
                        </p>
                    </article>

                    <article>
                        <span>Later</span>
                        <h3>Park and outdoor condition layers</h3>
                        <p>
                            National park views may return as a quieter outdoor-planning layer
                            once the core experience is fully aligned.
                        </p>
                    </article>
                </div>
            </section>

            <section className="about_closing">
                <p>Thanks for visiting.</p>

                <button className="ww_primary_btn" type="button" onClick={() => navigate("/search")}>
                    Open Weather Whale
                </button>
            </section>
        </main>
    );
}