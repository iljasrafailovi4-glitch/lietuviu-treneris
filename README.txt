HEADER UI FIX v11

1. Upload src/styles-header-v11.css to GitHub.
2. In src/main.jsx find:
   import './styles-v10.css';
   Immediately after it add:
   import './styles-header-v11.css';
3. In main.jsx change the visible navigation label:
   Количество -> Числительные
   Do NOT change mode="plural" or any program logic.
4. Commit changes. Vercel deploys automatically.

This stylesheet moves the navigation below the title, makes four equal tabs,
prevents overlap, and uses a 2x2 grid on small screens.
