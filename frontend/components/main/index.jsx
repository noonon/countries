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

                document.body.addEventListener('click', this.closeOverlayAction);
            },

            closeOverlayAction: function (event) {

                var className = (event.target).className;

                className = className.search(/main__content-choose/);

                if (className === -1 && this.state.overlay) {
                    this.closeOverlay()
                    event.stopPropagation()
                }
            },

            closeOverlay: function(){
                this.setState({overlay: false})
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
                  this.setState({overlay: true})
            },

            activeOverlay: function (flag, className) {

                return (flag) ? className : '';

            },

            setCity: function (key) {

                this.setState({
                    cityActive: key,
                    overlay: false,
                    countryActive: this.state.countryPreActive || this.state.countryActive,
                    countryPreActive: undefined
                })
            },

            setCountry: function (key) {
                this.setState({
                    countryPreActive: key
                });
            },
            activeCountry: function (active, preactive, key) {

                if (preactive !== undefined) {
                    return (preactive === key) ? 'main__content-choose-countries-list-item-text_active' : '';
                } else {
                    return (active === key) ? 'main__content-choose-countries-list-item-text_active' : '';
                }
            },

            titleAction: function (overlay, event) {

                return (function(event){

                    if (overlay === false || overlay === undefined) {
                        this.openOverlay();
                    }

                    event.stopPropagation()
                }).bind(this)
            },

            render() {

                var places = (this.getPlaces(this.state.countryActive, this.state.cityActive)),
                    countries = this.getCountries(),
                    cities = this.getCities(this.state.countryActive, this.state.countryPreActive);

                return <div className="main">
                    <div
                        className={(['main__title', this.activeOverlay(this.state.overlay, 'main__title_active')]).join(' ')}
                        onClick={this.titleAction.apply(this, [this.state.overlay])}>{ this.getCityName(this.state.countryActive, this.state.cityActive) }</div>
                    <div className="main__content">
                        <div
                            className={(["main__content-choose row", this.activeOverlay(this.state.overlay, 'main__content-choose_active')]).join(' ')}>
                            <div className="main__content-choose-countries col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <div className="main__content-choose-countries-list row ">
                                    {
                                        countries.map(function (item, key) {
                                            return <div className="main__content-choose-countries-list-item" key={key}>
                                                <span
                                                    onClick={function(){this.setCountry.apply(this, [key])}.bind(this)}
                                                    className={(["main__content-choose-countries-list-item-text", this.activeCountry(this.state.countryActive, this.state.countryPreActive, key)]).join(' ')}>{item.name}</span>
                                            </div>
                                        }.bind(this))
                                    }
                                </div>
                            </div>
                            <div className="main__content-choose-cities col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <div className="main__content-choose-cities-list row">
                                    {
                                        cities.map(function (item, key) {
                                            return <div className="main__content-choose-cities-list-item " key={key}>
                                                <span onClick={function(){this.setCity.apply(this, [key])}.bind(this)}
                                                      className="main__content-choose-cities-list-item-text">{item.name}</span>
                                            </div>
                                        }.bind(this))
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="main__content-places col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div className="main__content-places-list row ">
                                {
                                    places.map(function (item, key) {
                                        return <div className="main__content-places-list-item col-lg-3 col-md-4 col-xs-12 col-sm-4" key={key}>
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