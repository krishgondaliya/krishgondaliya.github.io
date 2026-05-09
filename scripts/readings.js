(function () {
  var state = {
    data: null,
    query: "",
    status: "all",
    tag: "all"
  };

  var root = document.getElementById("readings-root");
  var searchInput = document.getElementById("readings-search");
  var statusFilter = document.getElementById("readings-status");
  var tagFilter = document.getElementById("readings-tag");

  if (!root) return;

  function createElement(tagName, className, text) {
    var element = document.createElement(tagName);
    if (className) element.className = className;
    if (typeof text === "string") element.textContent = text;
    return element;
  }

  function normalize(value) {
    return String(value || "").toLowerCase();
  }

  function formatLabel(value) {
    return String(value || "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, function (letter) {
        return letter.toUpperCase();
      });
  }

  function collectEntries(data) {
    if (!data || !Array.isArray(data.sections)) return [];
    return data.sections.reduce(function (entries, section) {
      return entries.concat(getSectionEntries(section));
    }, []);
  }

  function getSectionEntries(section) {
    if (!section) return [];
    if (Array.isArray(section.subsections)) {
      return section.subsections.reduce(function (entries, subsection) {
        return entries.concat(Array.isArray(subsection.entries) ? subsection.entries : []);
      }, []);
    }
    return Array.isArray(section.entries) ? section.entries : [];
  }

  function entryMatches(entry) {
    var query = normalize(state.query);
    var tags = Array.isArray(entry.tags) ? entry.tags : [];
    var searchable = [
      entry.title,
      entry.author,
      entry.source,
      entry.summary,
      entry.status,
      entry.type,
      tags.join(" ")
    ].join(" ");

    var matchesQuery = !query || normalize(searchable).indexOf(query) !== -1;
    var matchesStatus = state.status === "all" || entry.status === state.status;
    var matchesTag = state.tag === "all" || tags.indexOf(state.tag) !== -1;

    return matchesQuery && matchesStatus && matchesTag;
  }

  function populateFilters(data) {
    var entries = collectEntries(data);
    var statuses = {};
    var tags = {};

    entries.forEach(function (entry) {
      if (entry.status) statuses[entry.status] = true;
      (entry.tags || []).forEach(function (tag) {
        tags[tag] = true;
      });
    });

    populateSelect(statusFilter, statuses, "All statuses");
    populateSelect(tagFilter, tags, "All tags");
  }

  function populateSelect(select, values, defaultLabel) {
    if (!select) return;
    select.textContent = "";
    select.appendChild(new Option(defaultLabel, "all"));

    Object.keys(values).sort().forEach(function (value) {
      select.appendChild(new Option(formatLabel(value), value));
    });
  }

  function render() {
    root.textContent = "";

    if (!state.data || !Array.isArray(state.data.sections)) {
      root.appendChild(createElement("p", "readings-state", "Readings data is unavailable."));
      return;
    }

    var renderedAny = false;

    state.data.sections.forEach(function (section) {
      var entries = getSectionEntries(section).filter(entryMatches);
      if (!entries.length && (!Array.isArray(section.subsections) || hasActiveFilters())) return;

      renderedAny = true;
      root.appendChild(renderSection(section, entries));
    });

    if (!renderedAny) {
      root.appendChild(createElement("p", "readings-state", "No readings match the current filters."));
    }
  }

  function hasActiveFilters() {
    return Boolean(state.query) || state.status !== "all" || state.tag !== "all";
  }

  function renderSection(section, entries) {
    var details = createElement("details", "readings-section");
    details.open = false;

    var summary = createElement("summary", "readings-section-summary");
    var titleWrap = createElement("span", "readings-section-title");
    titleWrap.appendChild(createElement("strong", null, section.title || "Untitled section"));
    titleWrap.appendChild(createElement("span", null, section.description || ""));
    summary.appendChild(titleWrap);
    summary.appendChild(createElement("span", "readings-count", String(entries.length)));
    details.appendChild(summary);

    var list = createElement("div", "readings-list");
    if (Array.isArray(section.subsections)) {
      section.subsections.forEach(function (subsection) {
        list.appendChild(renderSubsection(subsection));
      });
    } else {
      entries.forEach(function (entry) {
        list.appendChild(renderEntry(entry));
      });
    }
    details.appendChild(list);

    return details;
  }

  function renderSubsection(subsection) {
    var entries = (subsection.entries || []).filter(entryMatches);
    var details = createElement("details", "reading-subsection");
    details.open = false;

    var summary = createElement("summary", "reading-subsection-summary");
    summary.appendChild(createElement("strong", null, subsection.title || "Untitled category"));
    summary.appendChild(createElement("span", "readings-count", String(entries.length)));
    details.appendChild(summary);

    var list = createElement("div", "reading-subsection-list");
    if (entries.length) {
      entries.forEach(function (entry) {
        list.appendChild(renderEntry(entry));
      });
    } else {
      list.appendChild(createElement("p", "readings-state", "No readings yet."));
    }
    details.appendChild(list);

    return details;
  }

  function renderEntry(entry) {
    var details = createElement("details", "reading-entry");
    details.open = false;
    var summary = createElement("summary", "reading-row");
    summary.appendChild(renderEntryTitle(entry));
    summary.appendChild(createElement("span", "reading-row-status", formatLabel(entry.status || "notes")));
    details.appendChild(summary);

    var panel = createElement("div", "reading-panel");
    panel.appendChild(renderThumbnail(entry));

    var body = createElement("div", "reading-card-body");
    var meta = renderEntryMeta(entry);
    var author = createElement("span", "reading-author", [entry.author, entry.source].filter(Boolean).join(" - "));
    var description = createElement("span", "reading-summary", entry.summary || "");

    body.appendChild(meta);
    body.appendChild(author);
    body.appendChild(description);
    body.appendChild(renderTags(entry.tags || []));
    panel.appendChild(body);
    details.appendChild(panel);

    var notes = createElement("div", "reading-notes");
    if (Array.isArray(entry.groups) && entry.groups.length) {
      entry.groups.forEach(function (group) {
        notes.appendChild(renderGroup(group));
      });
    } else {
      notes.appendChild(createElement("p", "readings-state", "No detailed notes yet."));
    }
    details.appendChild(notes);

    return details;
  }

  function renderEntryMeta(entry) {
    var meta = createElement("span", "reading-meta");
    var parts = [
      ["Type", entry.type],
      ["Status", entry.status],
      ["Priority", entry.priority]
    ];

    parts.forEach(function (part) {
      if (!part[1]) return;
      meta.appendChild(createElement("span", "reading-eyebrow", part[0] + ": " + formatLabel(part[1])));
    });

    return meta;
  }

  function renderEntryTitle(entry) {
    var title = createElement("strong", "reading-title");

    if (entry.url) {
      var link = createElement("a", null, entry.title || "Untitled reading");
      link.href = entry.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      title.appendChild(link);
      return title;
    }

    title.textContent = entry.title || "Untitled reading";
    return title;
  }

  function renderThumbnail(entry) {
    var wrap = createElement("span", "reading-thumbnail");
    if (entry.id) wrap.classList.add("reading-thumbnail-" + entry.id);

    if (entry.thumbnail) {
      var image = document.createElement("img");
      image.src = entry.thumbnail;
      image.alt = entry.title ? entry.title + " cover" : "Reading cover";
      image.loading = "lazy";
      // Standard book-cover thumbnail width is 8rem unless an entry needs a custom size.
      if (entry.thumbnailWidth) {
        image.style.width = entry.thumbnailWidth;
      }
      image.addEventListener("error", function () {
        wrap.textContent = (entry.type || "note").slice(0, 2).toUpperCase();
      });
      wrap.appendChild(image);
      return wrap;
    }

    wrap.textContent = (entry.type || "note").slice(0, 2).toUpperCase();
    return wrap;
  }

  function renderTags(tags) {
    var wrap = createElement("span", "reading-tags");
    if (tags.length) {
      wrap.appendChild(createElement("strong", null, "Tags:"));
    }
    tags.forEach(function (tag) {
      wrap.appendChild(createElement("span", null, formatLabel(tag)));
    });
    return wrap;
  }

  function renderGroup(group) {
    var details = createElement("details", "note-group");
    details.open = false;

    var summary = createElement("summary", "note-group-summary");
    var title = createElement("span", null);
    title.appendChild(createElement("strong", null, group.title || "Untitled note"));
    if (group.kind) title.appendChild(createElement("em", null, formatLabel(group.kind)));
    summary.appendChild(title);
    details.appendChild(summary);

    if (group.summary) {
      details.appendChild(createElement("p", "note-group-description", group.summary));
    }

    var blocks = createElement("div", "note-blocks");
    (group.blocks || []).forEach(function (block) {
      blocks.appendChild(renderBlock(block));
    });
    details.appendChild(blocks);

    return details;
  }

  function renderBlock(block) {
    switch (block.type) {
      case "bullets":
        return renderBullets(block);
      case "code":
        return renderCode(block);
      case "equation":
        return renderEquation(block);
      case "image":
      case "gif":
        return renderImage(block);
      case "video":
        return renderVideo(block);
      case "embed":
        return renderEmbed(block);
      case "callout":
        return renderCallout(block);
      case "quote":
        return createElement("blockquote", "note-block note-quote", block.content || "");
      case "simulation":
        return renderSimulation(block);
      case "paragraph":
      default:
        return createElement("p", "note-block", block.content || "");
    }
  }

  function renderBullets(block) {
    var list = createElement("ul", "note-block note-bullets");
    (block.items || []).forEach(function (item) {
      list.appendChild(createElement("li", null, item));
    });
    return list;
  }

  function renderCode(block) {
    var pre = createElement("pre", "note-block note-code");
    var code = createElement("code", null, block.content || "");
    if (block.language) code.dataset.language = block.language;
    pre.appendChild(code);
    return pre;
  }

  function renderEquation(block) {
    var equation = createElement("pre", "note-block note-equation", block.content || "");
    equation.setAttribute("aria-label", "Equation");
    return equation;
  }

  function renderImage(block) {
    var figure = createElement("figure", "note-block media-block");
    if (block.src) {
      var image = document.createElement("img");
      image.src = block.src;
      image.alt = block.alt || "";
      image.loading = "lazy";
      figure.appendChild(image);
    }
    if (block.caption) figure.appendChild(createElement("figcaption", null, block.caption));
    return figure;
  }

  function renderVideo(block) {
    var wrap = createElement("figure", "note-block media-block");
    if (block.src) {
      var video = document.createElement("video");
      video.src = block.src;
      video.controls = true;
      video.preload = "metadata";
      wrap.appendChild(video);
    }
    if (block.caption) wrap.appendChild(createElement("figcaption", null, block.caption));
    return wrap;
  }

  function renderEmbed(block) {
    var wrap = createElement("div", "note-block embed-frame");
    if (block.src) {
      var iframe = document.createElement("iframe");
      iframe.src = block.src;
      iframe.title = block.title || "Embedded media";
      iframe.loading = "lazy";
      iframe.allowFullscreen = true;
      wrap.appendChild(iframe);
    } else {
      wrap.textContent = block.content || "Embedded media placeholder.";
    }
    return wrap;
  }

  function renderCallout(block) {
    var callout = createElement("aside", "note-block note-callout");
    if (block.title) callout.appendChild(createElement("strong", null, block.title));
    callout.appendChild(createElement("p", null, block.content || ""));
    return callout;
  }

  function renderSimulation(block) {
    var simulation = createElement("section", "note-block simulation-block");
    simulation.appendChild(createElement("strong", null, block.title || "Simulation"));
    simulation.appendChild(createElement("p", null, block.content || "Simulation placeholder."));
    return simulation;
  }

  function attachEvents() {
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        state.query = searchInput.value;
        render();
      });
    }

    if (statusFilter) {
      statusFilter.addEventListener("change", function () {
        state.status = statusFilter.value;
        render();
      });
    }

    if (tagFilter) {
      tagFilter.addEventListener("change", function () {
        state.tag = tagFilter.value;
        render();
      });
    }
  }

  function init() {
    root.appendChild(createElement("p", "readings-state", "Loading readings..."));

    fetch("/data/readings.json?v=thumbnails-3", { cache: "no-store" })
      .then(function (response) {
        if (!response.ok) throw new Error("Unable to load readings data.");
        return response.json();
      })
      .then(function (data) {
        state.data = data;
        populateFilters(data);
        render();
      })
      .catch(function () {
        root.textContent = "";
        root.appendChild(createElement("p", "readings-state", "Readings could not be loaded right now."));
      });
  }

  attachEvents();
  init();
})();
