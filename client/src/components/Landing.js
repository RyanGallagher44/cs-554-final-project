import React from 'react';

import '../App.css';

function Landing() {
  return (
    <div class = "landingPage">
      <h1>Welcome to HeaReal!</h1>
      <p class = "opener">Our first priority here is music. We believe that music has the power to connect everyone across the world. Using our 
         state-of-the-art feed, users can post about any type of music - whether it be that 80s song you heard on the
         radio today, or the new Lady Gaga album that just dropped. There's no limit to what music can make you feel - happy, sad,
         excited, you name it! That's why we provide a space for users to share their thoughts on the songs they pick. In addition
         to this, other users can like and comment to start a conversation!
      </p>
      <p class = "opener">We also want our users to be able to find new music! Check out our search feature that allows users
      to search through artists, albums, and songs. Users can find anything that interests them and like them to put them on their own page.
      Utilizing the last.fm api, our app pulls from their data to display as many songs, artists, and albums as possible.
      </p>
      <h2>Register today and find what to listen to next!</h2>
    </div>
  );
}

export default Landing;
