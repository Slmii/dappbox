import { Header } from 'components/Header';
import { constants } from 'lib/constants';
import { Box, Row } from 'ui-components/Box';
import { Button } from 'ui-components/Button';
import { PageTitle, Paragraph, SubTitle } from 'ui-components/Typography';

export const Error = ({ error, reset }: { error: Error; reset: () => void }) => {
	return (
		<>
			<Header />
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					textAlign: 'center',
					margin: constants.SPACING,
					height: 'calc(100vh - 235px)'
				}}
			>
				<Row>
					<div>
						<PageTitle>Something went wrong!</PageTitle>
						<Paragraph>We encountered an error while trying to connect with our server.</Paragraph>
						<Paragraph>You may refresh the page or try again later.</Paragraph>
						<Paragraph>
							If the problem persists feel free to contact us, providing the errors below.
						</Paragraph>
						<SubTitle gutter={false}>Type: {error.name}</SubTitle>
						<SubTitle gutter={false}>Message: {error.message}</SubTitle>
					</div>
					<Button type='button' label='Refresh' onClick={reset} />
				</Row>
			</Box>
		</>
	);
};
