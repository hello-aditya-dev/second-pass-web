# Test Strategy

The foundation currently relies on:

- TypeScript compiler
- ESLint
- Next.js production build

Before launch add targeted automated coverage for:

1. route smoke tests
2. article rendering
3. metadata/schema generation
4. keyboard navigation
5. newsletter submission after provider integration
6. CMS preview/publish lifecycle
7. 404 behavior
8. data-table rendering

Avoid building a huge test harness before the actual CMS and publishing workflow exist.
