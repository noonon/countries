/**
 * Created by noonon on 7/20/16.
 */

export default class main {
    constructor(React) {

        require('./style/index.styl');

        return React.createClass({

            getInitialState: function () {
                return {
                    countryDefault: 'russian',
                    cityDefault: 'moscow'
                };
            },

            componentDidMount: function () {

                var xhr = new XMLHttpRequest();
                xhr.open('GET', 'api/data', true);

                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            var data = JSON.parse(xhr.responseText),
                                country, city;

                            for (var i = data.length - 1; i >= 0; i--) {
                                if (data[i].code === this.state.countryDefault) {
                                    var cities = data[i].cities;
                                    for (var j = cities.length - 1; j >= 0; j--) {
                                        if (cities[j].code === this.state.cityDefault) {
                                            country = i;
                                            city = j;
                                            break;
                                        }
                                    }

                                    break;
                                }
                            }

                            this.setState({
                                data: data,
                                countryActive: country,
                                cityActive: city
                            });
                        }
                    }
                }.bind(this);
                xhr.send();

                document.body.addEventListener('click', this.closeOverlay);
            },

            closeOverlay: function (event) {

                var className = (event.target).className;

                className = className.search(/main__content-choose/);

                if (className === -1 && this.state.overlay) {
                    this.setState({overlay: false})
                }
            },

            componentWillUnmount: function () {

            },

            getCityName: function (country, city) {

                return (this.state.data !== undefined) ? this.state.data[country].cities[city].name : '';
            },

            getPlaces: function (country, city) {
                return (this.state.data !== undefined) ? this.state.data[country].cities[city].places : [];
            },

            getCountries: function () {
                return (this.state.data !== undefined) ? this.state.data : [];
            },

            getCities: function (country, preActiveCountry) {

                return (this.state.data !== undefined) ? this.state.data[preActiveCountry || country].cities : [];
            },

            openOverlay: function () {

                if (!this.state.overlay) {
                    this.setState({overlay: true})
                }
            },

            activeOverlay: function (flag) {

                return (flag) ? 'main__content-choose_active' : '';

            },

            setCity: function(key){

                this.setState({
                    cityActive: key,
                    overlay: false,
                    countryActive: this.state.countryPreActive || this.state.countryActive,
                    countryPreActive: undefined
                })
            },

            setCountry: function(key){
                this.setState({
                  countryPreActive: key
                });
            },
            activeCountry: function(active, preactive, key){

                if(preactive !== undefined){
                    return (preactive === key)? 'main__content-choose-countries-list-item-text_active': '';
                }else{
                    return (active === key)? 'main__content-choose-countries-list-item-text_active': '';
                }
            },

            render() {

                var places = (this.getPlaces(this.state.countryActive, this.state.cityActive)),
                    countries = this.getCountries(),
                    cities = this.getCities(this.state.countryActive, this.state.countryPreActive);

                return <div className="main">
                    <div
                        className="main__title"
                        onClick={this.openOverlay}>{ this.getCityName(this.state.countryActive, this.state.cityActive) }</div>
                    <div className="main__content">
                        <div className={(["main__content-choose", this.activeOverlay(this.state.overlay)]).join(' ')}>
                            <div className="main__content-choose-countries">
                                <div className="main__content-choose-countries-list">
                                    {
                                        countries.map(function(item, key){
                                            return <div className="main__content-choose-countries-list-item" key={key}>
                                                <span onClick={function(){this.setCountry.apply(this, [key])}.bind(this)} className={(["main__content-choose-countries-list-item-text", this.activeCountry(this.state.countryActive, this.state.countryPreActive, key)]).join(' ')}>{item.name}</span>
                                            </div>
                                        }.bind(this))
                                    }
                                </div>
                            </div>
                            <div className="main__content-choose-cities">
                                <div className="main__content-choose-cities-list">
                                    {
                                        cities.map(function(item, key){
                                            return <div className="main__content-choose-cities-list-item" key={key}>
                                                <span onClick={function(){this.setCity.apply(this, [key])}.bind(this)} className="main__content-choose-cities-list-item-text" >{item.name}</span>
                                            </div>
                                        }.bind(this))
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="main__content-places">
                            <div className="main__content-places-list">
                                {
                                    places.map(function (item, key) {
                                        return <div className="main__content-places-list-item" key={key}>
                                            <div className="main__content-places-list-item-name">{item.name}</div>
                                            <ul className="main__content-places-list-item-address">
                                                {
                                                    item.address.map(function (item, key) {
                                                        return <li key={key}
                                                                   className="main__content-places-list-item-address-item">{item}</li>
                                                    })
                                                }
                                            </ul>
                                            <div className="main__content-places-list-item-time">{item.time}</div>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            }
        });
    }
};