import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Activities } from 'components/Activities';
import { Layout } from 'components/Layout';
import { RequireAuthentication } from 'components/RequireAuthentication';
import { AuthenticatePage, FavoritesPage, HomePage } from 'pages';

// Register Error Overlay
const showErrorOverlay = (err: unknown) => {
	// must be within function call because that's when the element is defined for sure.
	const ErrorOverlay = customElements.get('vite-error-overlay');

	// don't open outside vite environment
	if (!ErrorOverlay) {
		return;
	}

	const overlay = new ErrorOverlay(err);
	document.body.appendChild(overlay);
};

window.addEventListener('error', showErrorOverlay);
window.addEventListener('unhandledrejection', ({ reason }) => showErrorOverlay(reason));

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<Layout />}>
					<Route
						path='/*'
						element={
							<RequireAuthentication>
								<HomePage />
								<Activities />
							</RequireAuthentication>
						}
					/>
					<Route
						path='/favorites'
						element={
							<RequireAuthentication>
								<FavoritesPage />
								<Activities />
							</RequireAuthentication>
						}
					/>
					<Route path='/authenticate' element={<AuthenticatePage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
