import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function Enter(props) {
	let params = useParams();
	let navigate = useNavigate();

	useEffect(() => {
	const verifySignIn = async () => {
		await props.signIn(params.email, params.link);
		navigate('/profile');
	};

		verifySignIn();
	}, [params.email, params.link, navigate, props]);

	return (
		<div>
			<p>Verifying your magic link</p>
		</div>
		);
}