'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navigation from '../../src/components/Navigation';
import BookingModal from '../../src/components/BookingModal';
import LoginModal from '../../src/components/LoginModal';
import { getAllPosts } from '../../src/data/blogData';
import { Icon } from '../../src/components/Icons';

export default function BlogArchivePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const posts = getAllPosts();
  const categories = ['All', 'Madrasha', 'Hifz Science', 'Inspiration', 'Community'];

  const filteredPosts =
    selectedCategory === 'All'
      ? posts
      : posts.filter((p) => p.category === selectedCategory || p.tags.includes(selectedCategory));

  return (
    <div className="blog-archive-page-root">
      {/* Sticky Navigation */}
      <Navigation
        onOpenBooking={() => setIsBookingOpen(true)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        currentPage="blog"
      />

      <main className="blog-archive-main">
        {/* Hub Hero Banner */}
        <section className="blog-hub-hero">
          <div className="hub-hero-badge">
            <span className="badge-dot">●</span>
            <span>Journal &amp; Updates</span>
          </div>
          <h1 className="hub-hero-title">
            Latest Updates from Our<br />
            <span className="title-accent">Islamic Center &amp; Madrasha</span>
          </h1>
          <p className="hub-hero-subtitle">
            Reflections, student milestones, pedagogical insights, and sacred community news from the scholars and students of Our Quran Institute.
          </p>

          {/* Category Filter Pills */}
          <div className="blog-category-filter">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`filter-pill ${selectedCategory === cat ? 'is-active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Posts Grid */}
        <section className="blog-posts-grid-section">
          <div className="posts-container">
            <div className="archive-cards-grid">
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="archive-card-link"
                >
                  <article className="archive-card">
                    <div className="archive-image-wrap">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="archive-cover-img"
                      />
                    </div>
                    <div className="archive-card-body">
                      <div className="archive-meta-row">
                        <span className="archive-cat-pill">{post.category}</span>
                        <span className="archive-date-item">
                          <span>📅</span>
                          <span>{post.date}</span>
                        </span>
                      </div>
                      <h3 className="archive-card-title">{post.title}</h3>
                      <p className="archive-card-snippet">{post.excerpt}</p>
                      <div className="archive-card-footer">
                        <span className="author-name">By {post.author}</span>
                        <span className="read-time-pill">{post.readTime}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Institute Footer */}
      <footer className="spread-footer institute-main-footer">
        <div className="footer-brand" style={{ cursor: 'pointer' }}>
          <img src="/assets/logo_gold.png" alt="Our Quran Institute" className="footer-brand-logo" />
          <div className="footer-brand-text">
            <span className="footer-brand-name">Our Quran Institute</span>
            <span className="footer-brand-tagline">Authentic Al-Azhar Quranic Studies</span>
          </div>
        </div>

        <div className="footer-links">
          <Link href="/" className="footer-link">Home</Link>
          <Link href="/courses" className="footer-link">Programs</Link>
          <Link href="/teachers" className="footer-link">Faculty</Link>
          <Link href="/methodology" className="footer-link">Methodology</Link>
          <Link href="/about" className="footer-link">About Us</Link>
          <Link href="/blog" className="footer-link">Journal</Link>
        </div>

        <div className="footer-social-links">
          <a href="https://wa.me/201094714943" target="_blank" rel="noopener noreferrer" className="footer-social-btn" title="WhatsApp (+20 10 94714943)">
            <Icon name="whatsapp" size={15} />
          </a>
          <a href="https://youtube.com/@ourquraninstitute" target="_blank" rel="noopener noreferrer" className="footer-social-btn" title="YouTube">
            <Icon name="youtube" size={15} />
          </a>
          <a href="https://facebook.com/ourquraninstitute" target="_blank" rel="noopener noreferrer" className="footer-social-btn" title="Facebook">
            <Icon name="facebook" size={15} />
          </a>
        </div>

        <span className="footer-copyright">© 2026 Our Quran Institute • All Rights Reserved</span>
      </footer>

      {/* Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}
