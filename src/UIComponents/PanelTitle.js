import React from 'react';
import './PanelTitle.css';

class PanelTitle extends React.Component {

    constructor(props) {
        super(props);
        // Props:
            // Gets "linksName" array of string which contain the name of each link
            // Gets "links" array of url string which contain the link
            // Gets string "link" to go back
            // For empty, give empty string.
            // Gets "key", to use as an id
    }

    render() {

        var links = [];

        if(this.props.links.length > 1) {
            this.props.links.forEach((link, linkIndex) => {
                if(linkIndex !== this.props.links.length - 1) {
                    links.push(
                        <a href={"/" + link} key={"breadcrumblink_"+linkIndex+"_"+this.props.keyValue}>{this.props.linksName[linkIndex]}</a>
                    );
                    links.push(
                        <i className="fa fa-angle-right" key={"breadcrumblinkicon_"+linkIndex+"_"+this.props.keyValue} />
                    );
                } else {
                    links.push(
                        <a className="breadcrumb-this" key={"breadcrumblink_"+"_"+this.props.keyValue}>{this.props.linksName[linkIndex]}</a>
                    );
                }
            });
        } else {
            links.push(
                <a href={"/" + this.props.links[0]} 
                    className="breadcrumb-this" 
                    key={"breadcrumblink_" + this.props.linksName[0]+"_"+this.props.keyValue}
                >
                    {this.props.linksName[0]}
                </a>
            );
        }

        var backLink = "";

        if (this.props.backLink !== "") {
            backLink =  <a className="go-back-button" href={"/"+this.props.backLink}>
                            <i className="fa fa-arrow-left" />
                        </a>;
        }

        return (
            <div className="PanelTitle">
                <div className="breadcrumb">
                    {links}
                </div>
                {backLink}
            </div>
          );
    }

}

export default PanelTitle;