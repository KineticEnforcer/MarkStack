/**
 * MarkStack - Client-side JavaScript
 * 
 * Handles interactive features for the documentation site:
 * - Theme toggle (dark/light mode with persistence)
 * - Sidebar navigation (collapsible tree with state persistence)
 * - Full-text search (fuzzy matching with keyboard navigation)
 * - Code block copy buttons
 * - Smooth scroll for anchor links
 * 
 * @version 1.0.0
 * @license GPL-3.0
 */

(function() {
  'use strict';

  // ============================================
  // Theme Toggle
  // ============================================
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  
  // Get saved theme or default to dark
  function getSavedTheme() {
    return localStorage.getItem('theme') || 'dark';
  }
  
  // Apply theme
  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
  
  // Initialize theme (already set by inline script, but ensure it's correct)
  setTheme(getSavedTheme());
  
  // Toggle theme on button click
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }

  // ============================================
  // Sidebar Toggle
  // ============================================
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const mainLayout = document.querySelector('.main-layout');
  const body = document.body;
  
  // Get saved sidebar state
  function getSavedSidebarState() {
    return localStorage.getItem('sidebar-state');
  }
  
  // Save sidebar state
  function saveSidebarState(collapsed) {
    localStorage.setItem('sidebar-state', collapsed ? 'collapsed' : 'expanded');
  }
  
  // Apply sidebar state (sync html, body, and mainLayout)
  function setSidebarCollapsed(collapsed) {
    if (collapsed) {
      html.classList.add('sidebar-collapsed');
      body.classList.add('sidebar-collapsed');
      if (mainLayout) mainLayout.classList.add('sidebar-collapsed');
    } else {
      html.classList.remove('sidebar-collapsed');
      body.classList.remove('sidebar-collapsed');
      if (mainLayout) mainLayout.classList.remove('sidebar-collapsed');
    }
  }
  
  // Initialize sidebar state
  if (mainLayout && sidebarToggle) {
    const savedState = getSavedSidebarState();
    // Default is expanded, only collapse if user explicitly collapsed
    setSidebarCollapsed(savedState === 'collapsed');
    
    // Toggle sidebar on button click
    sidebarToggle.addEventListener('click', function() {
      const isCurrentlyCollapsed = body.classList.contains('sidebar-collapsed');
      setSidebarCollapsed(!isCurrentlyCollapsed);
      saveSidebarState(!isCurrentlyCollapsed);
    });
  }

  // ============================================
  // Sidebar Tree Toggle
  // ============================================
  const sidebarNav = document.querySelector('.sidebar-nav');
  
  // Chevron SVG icons
  const chevronRight = '<svg class="sidebar-chevron" viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z"/></svg>';
  const chevronDown = '<svg class="sidebar-chevron" viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0Z"/></svg>';
  
  if (sidebarNav) {
    // Handle toggle button clicks for folder expand/collapse
    sidebarNav.addEventListener('click', function(e) {
      const toggle = e.target.closest('.sidebar-toggle');
      if (!toggle) return;
      
      e.preventDefault();
      e.stopPropagation();
      
      const sidebarItem = toggle.closest('.sidebar-item');
      const children = sidebarItem.querySelector('.sidebar-children');
      const isExpanded = sidebarItem.dataset.state === 'expanded';
      
      if (children) {
        if (isExpanded) {
          children.classList.remove('expanded');
          sidebarItem.dataset.state = 'collapsed';
          sidebarItem.classList.remove('sidebar-expanded');
          toggle.innerHTML = chevronRight;
        } else {
          children.classList.add('expanded');
          sidebarItem.dataset.state = 'expanded';
          sidebarItem.classList.add('sidebar-expanded');
          toggle.innerHTML = chevronDown;
        }
      }
    });
  }

  // ============================================
  // Search Functionality
  // ============================================
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  let searchIndex = null;
  let searchTimeout = null;

  // Escape HTML
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Escape regex special characters
  function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Load search index
  async function loadSearchIndex() {
    if (searchIndex) return searchIndex;
    
    try {
      const baseUrl = document.body.dataset.baseurl || '';
      const response = await fetch(baseUrl + '/search-index.json');
      searchIndex = await response.json();
      return searchIndex;
    } catch (error) {
      console.error('Failed to load search index:', error);
      return [];
    }
  }

  // Simple search function
  function performSearch(query, index) {
    if (!query || query.length < 2) return [];
    
    const queryLower = query.toLowerCase();
    const words = queryLower.split(/\s+/).filter(w => w.length > 1);
    
    const results = [];
    
    for (const item of index) {
      const titleLower = item.title.toLowerCase();
      const contentLower = (item.content || '').toLowerCase();
      const descriptionLower = (item.description || '').toLowerCase();
      
      // Calculate relevance score
      let score = 0;
      let matchContext = '';
      
      for (const word of words) {
        // Title matches are most important
        if (titleLower.includes(word)) {
          score += titleLower === word ? 100 : 50;
        }
        
        // URL path matches
        if (item.url.toLowerCase().includes(word)) {
          score += 30;
        }
        
        // Description matches
        if (descriptionLower.includes(word)) {
          score += 20;
        }
        
        // Content matches - find context around match
        const contentIndex = contentLower.indexOf(word);
        if (contentIndex !== -1) {
          score += 10;
          // Count additional occurrences
          const matches = (contentLower.match(new RegExp(escapeRegex(word), 'gi')) || []).length;
          score += Math.min(matches, 10); // Bonus for multiple matches, capped at 10
          
          // Extract context around the match if we don't have one yet
          if (!matchContext) {
            const start = Math.max(0, contentIndex - 60);
            const end = Math.min(item.content.length, contentIndex + word.length + 100);
            let excerpt = item.content.substring(start, end);
            
            // Clean up excerpt
            if (start > 0) excerpt = '...' + excerpt;
            if (end < item.content.length) excerpt = excerpt + '...';
            
            matchContext = excerpt;
          }
        }
      }
      
      if (score > 0) {
        results.push({ 
          ...item, 
          score,
          excerpt: matchContext || item.description || (item.content ? item.content.substring(0, 150) + '...' : '')
        });
      }
    }
    
    // Sort by score (highest first) and limit results
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }

  // Highlight matching text
  function highlightMatch(text, query) {
    if (!text) return '';
    const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 1);
    let result = escapeHtml(text);
    
    for (const word of words) {
      const regex = new RegExp(`(${escapeRegex(word)})`, 'gi');
      result = result.replace(regex, '<mark>$1</mark>');
    }
    
    return result;
  }

  // Hide search results
  function hideResults() {
    if (searchResults) {
      searchResults.classList.remove('active');
    }
  }

  // Render search results (dropdown)
  function renderResults(results, query) {
    if (!searchResults) return;
    
    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-no-results">No results found for "' + escapeHtml(query) + '"</div>';
      searchResults.classList.add('active');
      return;
    }
    
    let resultsHtml = '';
    for (let i = 0; i < results.length; i++) {
      const item = results[i];
      resultsHtml += '<a href="' + item.url + '" class="search-result-item">' +
        '<div class="search-result-title">' + highlightMatch(item.title, query) + '</div>' +
        '<div class="search-result-excerpt">' + highlightMatch(item.excerpt, query) + '</div>' +
        '<div class="search-result-path">' + item.url + '</div>' +
        '</a>';
    }
    
    searchResults.innerHTML = resultsHtml + '<div class="search-hint">Press Enter for full results</div>';
    searchResults.classList.add('active');
  }

  // Show full search results page (modal overlay)
  function showFullSearchResults(query, results) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.search-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.className = 'search-modal';
    
    let resultsHtml = '';
    if (results.length === 0) {
      resultsHtml = '<div class="search-modal-empty">' +
        '<p>No results found for "<strong>' + escapeHtml(query) + '</strong>"</p>' +
        '<p>Try different keywords or check your spelling.</p>' +
        '</div>';
    } else {
      for (let i = 0; i < results.length; i++) {
        const item = results[i];
        resultsHtml += '<a href="' + item.url + '" class="search-modal-result">' +
          '<div class="search-modal-result-header">' +
          '<span class="search-modal-result-title">' + highlightMatch(item.title, query) + '</span>' +
          '<span class="search-modal-result-path">' + item.url + '</span>' +
          '</div>' +
          '<div class="search-modal-result-excerpt">' + highlightMatch(item.excerpt, query) + '</div>' +
          '</a>';
      }
    }

    modal.innerHTML = '<div class="search-modal-backdrop"></div>' +
      '<div class="search-modal-content">' +
      '<div class="search-modal-header">' +
      '<h2>Search Results</h2>' +
      '<span class="search-modal-query">for "' + escapeHtml(query) + '"</span>' +
      '<span class="search-modal-count">' + results.length + ' result' + (results.length !== 1 ? 's' : '') + ' found</span>' +
      '<button class="search-modal-close" aria-label="Close">&times;</button>' +
      '</div>' +
      '<div class="search-modal-body">' + resultsHtml + '</div>' +
      '</div>';

    document.body.appendChild(modal);
    
    // Close handlers
    modal.querySelector('.search-modal-close').addEventListener('click', function() { modal.remove(); });
    modal.querySelector('.search-modal-backdrop').addEventListener('click', function() { modal.remove(); });
    
    function closeOnEscape(e) {
      if (e.key === 'Escape') {
        modal.remove();
        document.removeEventListener('keydown', closeOnEscape);
      }
    }
    document.addEventListener('keydown', closeOnEscape);

    // Hide dropdown
    hideResults();
  }

  // Search input handler
  if (searchInput) {
    searchInput.addEventListener('input', async function(e) {
      const query = e.target.value.trim();
      
      // Clear previous timeout
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      
      // Hide results if query is too short
      if (query.length < 2) {
        hideResults();
        return;
      }
      
      // Debounce search
      searchTimeout = setTimeout(async function() {
        const index = await loadSearchIndex();
        const results = performSearch(query, index);
        renderResults(results, query);
      }, 150);
    });
    
    // Hide results when clicking outside
    document.addEventListener('click', function(e) {
      if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        hideResults();
      }
    });
    
    // Show results when focusing on input
    searchInput.addEventListener('focus', async function() {
      const query = searchInput.value.trim();
      if (query.length >= 2) {
        const index = await loadSearchIndex();
        const results = performSearch(query, index);
        renderResults(results, query);
      }
    });
    
    // Keyboard navigation
    searchInput.addEventListener('keydown', async function(e) {
      if (e.key === 'Escape') {
        hideResults();
        searchInput.blur();
      }
      
      if (e.key === 'Enter') {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query.length >= 2) {
          const index = await loadSearchIndex();
          const results = performSearch(query, index);
          showFullSearchResults(query, results);
        }
      }
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const firstResult = searchResults.querySelector('.search-result-item');
        if (firstResult) {
          firstResult.focus();
        }
      }
    });
    
    // Navigate results with keyboard
    if (searchResults) {
      searchResults.addEventListener('keydown', function(e) {
        const current = document.activeElement;
        
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const next = current.nextElementSibling;
          if (next && next.classList.contains('search-result-item')) {
            next.focus();
          }
        }
        
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prev = current.previousElementSibling;
          if (prev && prev.classList.contains('search-result-item')) {
            prev.focus();
          } else {
            searchInput.focus();
          }
        }
        
        if (e.key === 'Escape') {
          hideResults();
          searchInput.focus();
        }
      });
    }
  }

  // Keyboard shortcut to focus search (Ctrl+K)
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }
  });

  // ============================================
  // Smooth Scroll for Anchor Links
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Update URL without jumping
        history.pushState(null, null, href);
      }
    });
  });

  // ============================================
  // Copy Code Blocks
  // ============================================
  document.querySelectorAll('pre.hljs').forEach(function(block) {
    // Create copy button
    const button = document.createElement('button');
    button.className = 'copy-code-btn';
    button.textContent = 'Copy';
    button.setAttribute('aria-label', 'Copy code to clipboard');
    
    // Wrap pre in container
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper';
    block.parentNode.insertBefore(wrapper, block);
    wrapper.appendChild(block);
    wrapper.appendChild(button);
    
    // Copy on click
    button.addEventListener('click', async function() {
      const code = block.querySelector('code');
      const text = code ? code.textContent : block.textContent;
      
      try {
        await navigator.clipboard.writeText(text);
        button.textContent = 'Copied!';
        button.classList.add('copied');
        
        setTimeout(function() {
          button.textContent = 'Copy';
          button.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
        button.textContent = 'Failed';
        
        setTimeout(function() {
          button.textContent = 'Copy';
        }, 2000);
      }
    });
  });

})();
