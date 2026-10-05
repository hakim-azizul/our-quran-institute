'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { blogPosts } from '../data/blogData';
import { Icon } from './Icons';

export default function LatestUpdatesSection() {
  const [activePageIndex, setActivePageIndex] = useState(0);

  // We display 3 posts per page on desktop
  const postsPerPage = 3;
  const totalPages = Math.ceil(blogPosts.length / postsPerPage);

  const displayedPosts = blogPosts.slice(
    activePageIndex * postsPerPage,
    activePageIndex * postsPerPage + postsPerPage
  );

  return (
    <section id="section-latest-updates" className="latest-updates-section">
      <div className="updates-container">
        {/* Section Header */}
        <div className="updates-header">
          <div className="updates-badge-pill">
            <span className="badge-dot">●</span>
            <span className="badge-label">Institute Journal</span>
          </div>

          <h2 className="updates-main-title">
            Latest Updates from Our<br />
            <span className="title-accent">Islamic Center</span>
          </h2>

          <p className="updates-subtitle">
            Reflections, scholarly insights, and milestones from our global sanctuary of learning.
          </p>
        </div>

        {/* 3-Card Grid matching reference design */}
        <div className="updates-cards-grid">
          {displayedPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="update-card-link"
              title={`Read: ${post.title}`}
            >
              <article className="update-card">
                {/* Image Container with smooth zoom animation */}
                <div className="card-image-wrap">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="card-cover-img"
                    loading="lazy"
                  />
                  <div className="card-hover-overlay">
                    <span className="read-article-pill">
                      <span>Read Article</span>
                      <Icon name="arrow-right" size={13} color="#FFFFFF" />
                    </span>
                  </div>
                </div>

                {/* Card Content Footer */}
                <div className="card-body">
                  {/* Category Pill & Date Row */}
                  <div className="card-meta-row">
                    <span className="card-category-pill">
                      {post.category}
                    </span>

                    <span className="card-date-item">
                      <span className="calendar-icon">📅</span>
                      <span className="date-text">{post.date}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="card-article-title">
                    {post.title}
                  </h3>

                  {/* Subtle Excerpt snippet on larger screens */}
                  <p className="card-excerpt">
                    {post.excerpt}
                  </p>

                  {/* Author line */}
                  <div className="card-author-footer">
                    <span className="author-name">By {post.author}</span>
                    <span className="read-time-tag">{post.readTime}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Carousel / Slider Indicator (Matching green active bar + dots in reference image) */}
        <div className="updates-pagination-dock">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActivePageIndex(idx)}
              className={`pagination-dot-indicator ${activePageIndex === idx ? 'is-active' : ''}`}
              aria-label={`Go to slide ${idx + 1}`}
              title={`Page ${idx + 1}`}
            />
          ))}
        </div>

        {/* View All Articles Hub Link */}
        <div className="updates-footer-cta">
          <Link href="/blog" className="btn-browse-all-articles">
            <span>Explore All Journal Articles</span>
            <Icon name="arrow-up-right" size={14} color="#15321D" />
          </Link>
        </div>
      </div>
    </section>
  );
}
