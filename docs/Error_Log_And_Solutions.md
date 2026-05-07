# Scribbles & Slates — Error Log & Solutions

During the development of the application, we encountered several complex edge-cases and errors. This document serves as a reference for how they were identified and resolved, aiding in future maintenance.

---

### 1. Tailwind CSS `@apply` Compilation Failure
- **The Error**: `[plugin:vite:css] @apply should not be used with the 'group' utility`
- **The Cause**: We attempted to nest pseudo-classes (`group-hover:`) inside a global `@apply` directive within `index.css`. Tailwind's JIT compiler does not support combining complex state modifiers with `@apply` extraction.
- **The Solution**: We refactored the CSS to use base generic styles in `index.css` and moved the complex interaction classes (like `group-hover:scale-105`) directly into the React component `className` attributes.

### 2. React Router Context Violation
- **The Error**: `useNavigate() may be used only in the context of a <Router> component.`
- **The Cause**: Hooks from `react-router-dom` were being called inside `Header.jsx` and `App.jsx` *before* the component tree was wrapped in the `<BrowserRouter>` provider.
- **The Solution**: We moved the `<BrowserRouter>` wrapper out of `App.jsx` and up into the root `main.jsx` entry file, ensuring the entire application had access to routing context.

### 3. Cart State Corruption (`NaN` Pricing)
- **The Error**: The Cart Drawer and Checkout pages began displaying `NaN` (Not a Number) for totals, and products appeared completely blank.
- **The Cause**: During early development, incomplete items (missing prices and IDs) were saved into the browser's `localStorage`. When the backend was finalized, the frontend was still loading these "ghost" items and attempting to multiply `undefined * qty`, resulting in `NaN`.
- **The Solution**: We implemented aggressive sanitization in `CartContext.jsx`. The `loadFromLS()` function was updated to filter out any object that did not pass a strict `typeof item.priceAtAdd === 'number'` check before loading it into the React state.

### 4. Mongoose Validation "Infinite Sync Loop"
- **The Error**: `Failed to load resource: the server responded with a status of 500 (Internal Server Error)` repeatedly logging in the browser console.
- **The Cause**: When the frontend attempted to sync the corrupted `localStorage` cart to the backend upon login, Mongoose correctly rejected the corrupted items and threw a `ValidationError`. Because the backend returned a `500` error, the frontend skipped its cleanup code (`localStorage.removeItem()`). The next time the user refreshed, the cycle repeated.
- **The Solution**: 
  1. We added strict payload sanitization in `server/routes/cart.js` to strip bad items before querying the database.
  2. We wrapped the route in a graceful fallback: if an error occurs, it catches the error and returns a `200 OK` with the existing database cart, rather than throwing a `500`. This tricks the frontend into successfully breaking the loop and purging its local cache.

### 5. Circular JSON Serialization Crash
- **The Error**: The backend failed to respond or crashed when adding items to the cart.
- **The Cause**: In `server/utils/pricing.js`, we used the spread operator (`...item`) to attach a discount calculation. However, `item` was a raw Mongoose Document. Spreading a Mongoose Document injects massive internal objects (`__parentArray`, `$__`) containing circular references, breaking Express's `res.json()`.
- **The Solution**: We used `item.toObject ? item.toObject() : item` to safely strip away all Mongoose metadata, ensuring only plain JavaScript objects were sent to the client.

### 6. React Strict Mode Race Conditions (`E11000`)
- **The Error**: `MongoServerError: E11000 duplicate key error collection: test.carts index: userId_1 dup key`
- **The Cause**: React's Strict Mode (which double-mounts components in development to test for side-effects) caused the `CartContext` to fire two simultaneous `POST /api/cart/sync` requests. Both requests saw an empty database, both created a new cart, and the second one failed the unique `userId` constraint.
- **The Solution**: The graceful fallback logic implemented for Error #4 automatically caught the `E11000` error, retrieved the cart created by the first request, and successfully returned it, allowing the application to function perfectly without any frontend disruption.
