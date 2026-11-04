<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Share question gameplay and reward presentation in a browser-safe mission component; keep each world's question data and completion records separate to preserve Forest compatibility.
- Derive Valley question content from glossary references without duplicating definitions or changing glossary assignments; this prevents content drift.
- Preserve the existing localStorage key and Forest fields, default new Valley fields during reads, and persist in-flight quiz sessions to support existing players and reloads.
- Keep Valley adventure zone definitions and validation in a browser-safe domain module, separate from legacy quizzes; persist drafts and sequential completion atomically with idempotent zone rewards to support reloads without duplicate XP.
- Use a shared browser-safe two-sided MagicCard for Valley challenges and collection; persist optional discovery IDs in existing zone drafts and derive collected concepts from drafts/completions so legacy saves and once-per-zone rewards remain compatible.
