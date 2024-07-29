import React from 'react';
import LandingBox from '../components/LandingBox';
import Blog from './Blog';
import About from './About';
import Pricing from './Pricing';
import Whitepaper from './Whitepaper';

const Landing = () => (
	<>
		<LandingBox />
		<About />

		<div className="wrapper-fon">
			<Pricing />
			<Blog />
		</div>

		<Whitepaper />
	</>
);

export default Landing;
