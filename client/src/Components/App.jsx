import React from 'react';
import axios from 'axios';
import BannerImage from './BannerImage.jsx';
import Summary from './Summary.jsx';
import Details from './Details.jsx';
import Tags from './Tags.jsx';
import styles from '../../../public/style.css';
import isPosOrNeg from '../../../utils/utilities.js';
import { devEndpoint, prodEndpoint, nodeEnv } from '../../../config.js';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameId: window.location.pathname.split('/')[1],
      image: 'https://source.unsplash.com/random/460x125',
      description: '',
      release_date: '',
      developer: '',
      publisher: '',
      tags: [],
      totalReviews: [],
      percentTotalReviewsPosOrNeg: '',
      overallPosOrNeg: '',
      recentPosOrNeg: '',
      recent: [],
      percentRecentPosOrNeg: ''
    };

    this.endpoint = '';
  }

  componentDidMount() {
    // console.log('nodeEnv', nodeEnv);
    if (nodeEnv === 'production') {
      this.endpoint = prodEndpoint;
    } else {
      this.endpoint = devEndpoint;
    }

    this.getGameData();
    this.getImage();
    this.getReviews();
  }

  getGameData() {
    axios.get(`/api/overview/${this.state.gameId}`)
      .then((res) => {
        // handle data
        this.setState({
          description: res.data[0].description,
          release_date: res.data[0].release_date,
          developer: res.data[0].developer,
          publisher: res.data[0].publisher,
          tags: res.data[0].tags
        })
      })
      .catch((err) => {
        console.log(`/api/overview/${this.state.gameId}`)
        console.log('error in overview get request in client', err);
      });
  }

  getImage() {
    axios.get(`/api/overviewImage/${this.state.gameId}`)
      .then((res) => {
        // handle data
        if (res.data !== undefined) {
          this.setState({ image: res.data })
        }
      })
      .catch((err) => {
        console.log('error in image get request in client', err);
      });
  }

  getReviews() {
    axios.get(`/api/reviews/1`)
    .then((data) => {
      this.setState({
        totalReviews: data.data
      });
    })
    .then(() => {
      let posOrNeg = isPosOrNeg(this.state.totalReviews);
      this.setState({
        overallPosOrNeg: posOrNeg[1],
        percentTotalReviewsPosOrNeg: posOrNeg[0]
      });
    })
    .then(() => {
      let recent = [];
      let today = new Date();
      let thirtyDaysAgo = new Date(today - (30 * 86400000));
      for (let i = 0; i < this.state.totalReviews.length; ++i) {
        let posted = new Date(this.state.totalReviews[i].posted);
        if (thirtyDaysAgo <= posted && posted <= today) {
          recent.push(this.state.totalReviews[i]);
        }
      }
      let posOrNeg = isPosOrNeg(recent);
      this.setState({
        recent: recent,
        recentPosOrNeg: posOrNeg[1],
        percentRecentPosOrNeg: posOrNeg[0]
      });
    })
    .catch((err) => {
      console.log('error in reviews get request in client', err);
    });
  }

  render() {
    const {state} = this;
    return (
      <div className={styles.container}>
            <BannerImage image={state.image} />
            <Summary description={state.description} />
            <Details
              developer={state.developer}
              publisher={state.publisher}
              release_date={state.release_date}
              totalReviews={state.totalReviews}
              percentTotalReviewsPosOrNeg={state.percentTotalReviewsPosOrNeg}
              overallPosOrNeg={state.overallPosOrNeg}
              recentPosOrNeg={state.recentPosOrNeg}
              recent={state.recent}
              percentRecentPosOrNeg={state.percentRecentPosOrNeg}
            />
            <Tags userTags={state.tags} />
      </div>
    );
  }
}

export default App;