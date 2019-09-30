import React, { Component } from 'react';
import './Home.css';
import Header from '../../common/Header';
import GridList from '@material-ui/core/GridList';
import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card';
import GridListTile from '@material-ui/core/GridListTile';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import 'font-awesome/css/font-awesome.min.css';

class Home extends Component {
    constructor() {
        super();
        this.state = {
            restaurants: [],
            cards: 0
        }
    }
    //Added unsafe to supress the warning in the chrome
    UNSAFE_componentWillMount() {
        sessionStorage.removeItem('customer-cart');
        let _this = this;
        let dataRestaurants = null;
        let xhrRestaurants = new XMLHttpRequest();
        xhrRestaurants.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
                _this.setState({
                    restaurants: JSON.parse(this.responseText).restaurants
                });
            }
        })
        xhrRestaurants.open('GET', this.props.baseUrl +'restaurant');
        xhrRestaurants.send(dataRestaurants);
        this.updateCardsGridListCols();
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateCardsGridListCols);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateCardsGridListCols);
    }

    //Update the number of cards as per screen size
    updateCardsGridListCols = () => {
        if (window.innerWidth >= 1350) {
            this.setState({ cards: 5 });
            return;
        }

        if (window.innerWidth >= 1100) {
            this.setState({ cards: 4 });
            return;
        }

        if (window.innerWidth >= 900) {
            this.setState({ cards: 3 });
            return;
        }
        if (window.innerWidth >= 600) {
            this.setState({ cards: 2 });
            return;
        }
        this.setState({ cards: 1 });
    }

    restaurantCardTileOnClickHandler = (restaurantId) => {
        this.props.history.push('/restaurant/' + restaurantId);
    }
    //implement the search handler
    searchHandler = (event) => {
        let _this = this;
        let dataRestaurants = null;
        let xhrRestaurants = new XMLHttpRequest();
        xhrRestaurants.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
                if (!JSON.parse(this.responseText).restaurants) {
                    _this.setState({
                        restaurants: null,
                    })
                } else {
                    _this.setState({
                        restaurants: JSON.parse(this.responseText).restaurants,
                    })
                }
            }
        })
        if (event.target.value === '') {
            xhrRestaurants.open('GET', this.props.baseUrl + 'restaurant');
        } else {
            xhrRestaurants.open('GET', this.props.baseUrl + 'restaurant/name/'+event.target.value);
        }
        xhrRestaurants.send(dataRestaurants);
    }

    render() {
        return (
            <div>
                <Header
                    showSearchBox={true}
                    searchHandler={this.searchHandler}
                />
                {this.state.restaurants === null ?
                    <Typography className='noRestaurant' variant='h6'>
                        No restaurant with the given name.
                    </Typography>
                    :
                    <GridList
                        className='gridList'
                        cols={this.state.cards}
                        cellHeight='auto'
                    >
                        {this.state.restaurants.map(restaurant => (
                            <GridListTile
                                onClick={() => this.restaurantCardTileOnClickHandler(restaurant.id)}
                                key={'restaurant' + restaurant.id}
                            >
                                <Card className='card' style={{ textDecoration: 'none' }}>
                                    <CardMedia
                                        className='cardMedia'
                                        image={restaurant.photo_URL}
                                        title={restaurant.restaurant_name}
                                    />
                                    <CardContent className='cardContent'>
                                        <Typography className='restaurantName' gutterBottom variant='h5' component='h2'>
                                            {restaurant.restaurant_name}
                                        </Typography>
                                        <Typography variant='subtitle1' className='categories'>
                                            {restaurant.categories}
                                        </Typography>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', flexDirection: 'row', color:"white", backgroundColor: "#FDD835", padding: 5, justifyContent: 'space-evenly', alignItems: 'center', width: 80 }}>
                                            <i className="fa fa-star" aria-hidden="true"> </i>
                                                <span className="white">{restaurant.customer_rating}({restaurant.number_customers_rated})</span>
                                            </div>
                                            <div>
                                            <i className="fa fa-inr" aria-hidden="true"> 
                                                <span>{restaurant.average_price} for two</span> </i>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </GridListTile>
                        ))}
                    </GridList>
                }
            </div>
        );
    }
}

export default Home;