# Day 15 - Multi Language Support

## Goal

Add a clear path for English and Arabic support, including route strategy, translated UI strings, RTL layout behavior, validation messages, and localized metadata.

## Planning Status

This day is planned, not implemented yet.

## Course Position

After the core product is stable, discoverable, and performance-reviewed, Day 15 can make the app region-ready. This is best done after most flows exist, because internationalization touches many UI surfaces.

The current pain to show first:

- UI strings are hardcoded in English.
- Arabic course labels exist outside the app, but the app itself is not localized.
- RTL layout behavior is not handled.
- Validation messages are English-only.
- Metadata is not localized.

## Proposed Lessons

### Lesson 1 - Decide the Locale Strategy

Start by comparing options:

```txt
/en/jobs
/ar/jobs
```

or:

```txt
en.wazifa.app
ar.wazifa.app
```

Recommended for teaching:

- Use path-based locales first: `/en`, `/ar`.
- Keep subdomains focused on app surfaces: public/admin/staging.

Teaching point:

> Choose one routing strategy early. Localization affects URLs, metadata, and navigation.

### Lesson 2 - Add Locale Routing

Proposed structure:

```txt
app/
  [locale]/
    (client)/
    (auth)/
```

Or a smaller first step:

```txt
app/(client)/
```

continues to serve default locale while translations are introduced gradually.

Decision depends on how much restructuring is acceptable after Day 14.

Teaching point:

> Internationalization is routing plus content, not just a dictionary file.

### Lesson 3 - Create Dictionaries

Proposed files:

```txt
dictionaries/en.ts
dictionaries/ar.ts
lib/i18n.ts
```

Dictionary areas:

- navbar
- auth forms
- job cards
- apply form
- admin sidebar
- validation messages
- common buttons

Teaching point:

> Start with domain-specific translation keys, not random one-off strings.

### Lesson 4 - Translate Public Pages

Start with public pages:

- landing
- jobs listing
- job details
- apply prompt
- login/signup labels

Teaching point:

> Public candidate-facing pages should get localization before admin tools unless the business needs admin localization first.

### Lesson 5 - RTL Support

Arabic needs RTL behavior:

- `dir="rtl"` on Arabic pages
- spacing direction review
- sidebar/nav alignment review
- icon direction where needed
- form labels and inputs

Teaching point:

> Translation changes words. RTL changes layout behavior.

### Lesson 6 - Localized Validation Messages

Validation messages currently live in zod schemas. Plan how to localize:

- keep schemas message-key based, or
- build schemas with locale-aware messages, or
- map errors at the service/action boundary.

Teaching point:

> User-facing validation text is product copy, so it should be localized too.

### Lesson 7 - Localized Metadata and SEO

Update Day 13 SEO work:

- locale-specific titles/descriptions
- alternate language links
- localized canonical strategy
- Arabic Open Graph metadata

Teaching point:

> Multi-language support is incomplete if search results and shared links stay in one language.

### Lesson 8 - Language Switcher

Add a switcher that:

- keeps the current page equivalent where possible
- preserves important query params
- switches between English and Arabic

Teaching point:

> A language switcher should change language, not unexpectedly reset the user's task.

## Expected End State

- The app has a clear locale routing strategy.
- English and Arabic dictionaries exist.
- Key public pages are translated.
- Arabic pages render with RTL direction.
- Validation and metadata have a localization path.
- A language switcher exists or is clearly planned.

## Open Decisions

- Path-based vs domain-based locale routing.
- Whether admin pages need Arabic in the first pass.
- Which i18n library to use, if any.
- How much of the app should be translated in Day 15.

## Production Notes

- Avoid mixing translated and untranslated UI on the same page when possible.
- Test RTL visually, not only through code review.
- Keep route and metadata strategy consistent.
- Do not localize internal enum values directly; map them to display labels.
- Consider SEO impact before changing public URL structures.
