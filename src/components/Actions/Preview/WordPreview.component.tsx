import mammoth from 'mammoth';
import { useEffect, useState } from 'react';

import { Asset } from 'lib/types';

export const WordPreview = ({ url }: { url: string; asset: Asset }) => {
	const [content, setContent] = useState('');

	// useEffect(() => {
	// 	const readFile = async () => {
	// 		const arrayBuffer = await (await fetch(url)).arrayBuffer();

	// 		mammoth
	// 			.convertToHtml({ arrayBuffer })
	// 			.then(result => {
	// 				setContent(result.value);
	// 			})
	// 			.catch(err => {
	// 				console.error('Error converting Word to HTML:', err);
	// 			});
	// 	};
	// 	readFile();
	// }, [url]);

	return (
		<div>
			<div
				dangerouslySetInnerHTML={{
					__html: content
				}}
			/>
		</div>
	);
};
