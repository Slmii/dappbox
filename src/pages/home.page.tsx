import { Home } from 'components/home';
import { Helmet } from 'ui-components/helmet';

export const HomePage = () => {
	return (
		<>
			<Helmet title='Home' />
			<Home />
		</>
	);
};
