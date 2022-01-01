import { Helmet as ReactHelmet } from 'react-helmet-async';

/**
 * Component that is required to be wrapped in every page. This will show the `title` in the browser's tab
 */
export const Helmet: React.FC<{ title: string }> = ({ title }) => {
	return (
		<ReactHelmet>
			<title>{title}</title>
		</ReactHelmet>
	);
};
