'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import Navigation from '../../../src/components/Navigation';
import BookingModal from '../../../src/components/BookingModal';
import LoginModal from '../../../src/components/LoginModal';
import { getPostBySlug, getAllPosts } from '../../../src/data/blogData';
import { Icon } from '../../../src/components/Icons';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug;
  const post = getPostBySlug(slug);

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  if (!post) {
    return (
      <div className="article-not-found-page">
        <Navigation
          onOpenBooking={() => setIsBookingOpen(true)}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          currentPage="blog"
        />
        <div className="not-found-content">
          <h2>Article Not Found</h2>
          <p>The requested journal update could not be found or has moved.</p>
          <Link href="/blog" className="btn-back-home">
            Return to Journal
          </Link>
        </div>
      </div>
    );
  }

  // Related articles (excluding current)
  const allPosts = getAllPosts();
  const relatedPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 3);

  // WhatsApp share link
  const shareMessage = encodeURIComponent(
    `Read this article from Our Quran Institute: "${post.title}"\nhttps://ourquraninstitute.com/blog/${post.slug}`
  );
  const waShareUrl = `https://wa.me/?text=${shareMessage}`;

  return (
    <div className="blog-article-page-root">
      {/* Sticky Header Navigation */}
      <Navigation
        onOpenBooking={() => setIsBookingOpen(true)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        currentPage="blog"
      />

      <main className="blog-article-main">
        {/* Breadcrumb Navigation */}
        <div className="article-breadcrumb-container">
          <nav className="article-breadcrumbs" aria-label="Breadcrumb">
            <Link href="/" className="crumb-link">Home</Link>
            <span className="crumb-separator">/</span>
            <Link href="/blog" className="crumb-link">Journal</Link>
            <span className="crumb-separator">/</span>
            <span className="crumb-category">{post.category}</span>
          </nav>
        </div>

        {/* Article Header & Meta */}
        <header className="article-hero-header">
          <div className="article-header-meta">
            <span className="article-category-badge">{post.category}</span>
            <span className="article-date">
              <span className="calendar-icon">📅</span>
              {post.date}
            </span>
            <span className="article-read-time">⏳ {post.readTime}</span>
          </div>

          <h1 className="article-page-title">{post.title}</h1>

          <div className="article-author-card">
            <div className="author-avatar-circle">
              <span>{post.author.charAt(0)}</span>
            </div>
            <div className="author-info-text">
              <span className="author-name-text">{post.author}</span>
              <span className="author-role-text">{post.authorRole}</span>
            </div>
          </div>
        </header>

        {/* Featured Cover Image */}
        <div className="article-cover-wrap">
          <img
            src={post.coverImage}
            alt={post.title}
            className="article-cover-image"
          />
        </div>

        {/* Article Content Layout */}
        <div className="article-content-container">
          <div
            className="article-rich-body"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags & Share Row */}
          <div className="article-tags-share-bar">
            <div className="article-tags-list">
              <span className="tags-label">Topics:</span>
              {post.tags.map((tag) => (
                <span key={tag} className="article-topic-tag">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="article-share-actions">
              <a
                href={waShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-share-whatsapp"
                title="Share on WhatsApp"
              >
                <Icon name="whatsapp" size={16} color="#FFFFFF" />
                <span>Share Article</span>
              </a>
            </div>
          </div>

          {/* Scholar Consultation Callout Box */}
          <div className="article-scholar-callout">
            <div className="callout-ornament">✦</div>
            <div className="callout-text-group">
              <h4 className="callout-heading">Embark on Your Personal Quran Journey</h4>
              <p className="callout-desc">
                Learn 1-on-1 under the guidance of certified scholars from Al-Azhar University. Begin with a free 30-minute diagnostic session.
              </p>
            </div>
            <button
              type="button"
              className="btn-callout-book"
              onClick={() => setIsBookingOpen(true)}
            >
              <span>Book Free Session</span>
              <Icon name="arrow-up-right" size={13} color="#062A24" />
            </button>
          </div>
        </div>

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <section className="article-related-section">
            <div className="related-header">
              <h3 className="related-title">Related Journal Updates</h3>
              <Link href="/blog" className="related-view-all">
                <span>View all updates</span>
                <Icon name="arrow-right" size={14} color="#8CC63F" />
              </Link>
            </div>

            <div className="related-cards-grid">
              {relatedPosts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.slug}`}
                  className="related-card-link"
                >
                  <div className="related-card">
                    <div className="related-image-wrap">
                      <img
                        src={rel.coverImage}
                        alt={rel.title}
                        className="related-cover-img"
                      />
                    </div>
                    <div className="related-body">
                      <div className="related-meta">
                        <span className="related-cat">{rel.category}</span>
                        <span className="related-date">{rel.date}</span>
                      </div>
                      <h4 className="related-card-title">{rel.title}</h4>
                      <p className="related-snippet">{rel.excerpt}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
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
