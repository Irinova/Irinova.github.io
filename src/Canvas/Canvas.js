import React from 'react';
import styles from './Canvas.module.css';
import {connect} from "react-redux";
import {changeHeight, changeWidth} from '../redux/bannerSize/banner.actions'


class Canvas extends React.Component {

    constructor(props) {
        super(props);
        this.isMoved = false;
        this.x = 0;
        this.y = 0;
    }

    state = {
        sizeValue: 'px',
        scale: 1,
        x: 0,
        y: 0
    };

    transformScale = () => {
        return {
            transform: 'scale(' + this.state.scale + ')'
        }
    };

    transformPosition = () => {
        return {
            transform: 'translateX(' + this.state.x * (1 / this.state.scale) + 'px) translateY(' + this.state.y * (1 / this.state.scale) + 'px)'
        }
    };

    getBannerSizes = () => {
        const width = this.props.bannerSize.width;
        const height = this.props.bannerSize.height;
        return {
            width: width + this.state.sizeValue,
            height: height + this.state.sizeValue
        }
    };

    handleWheel = (e) => {
        const delta = e.deltaY || e.detail;

        if (delta > 0) {
            if (this.state.scale >= 2) {
                this.setState({
                    scale: 2
                })
            } else {
                this.setState({
                    scale: this.state.scale + 0.05
                });
            }
        } else {
            if (this.state.scale <= 1) {
                this.setState({
                    scale: 1
                })
            } else {
                this.setState({
                    scale: this.state.scale - 0.05
                });
            }
        }

    };

    handleMouseDown = (e) => {
        e.persist();
        this.isMoved = true;
        this.x = e.clientX - this.x;
        this.y = e.clientY - this.y;
    };

    handleMouseMove = (e) => {
        e.persist();
        if (this.isMoved) {
            this.setState({
                x: e.clientX - this.x,
                y: e.clientY - this.y
            });
        }
    };

    handleMouseUp = (e) => {
        e.persist();
        this.isMoved = false;
        this.x = e.clientX - this.x;
        this.y = e.clientY - this.y;
    };

    addBackground = (obj) => {
        if (obj.type === 'fill') {
            return {background: obj.resource}
        }
        if (obj.type === 'image') {
            return {
                background: obj.resource,
                backgroundSize: 'contain',
                width: '100%',
                height: '100%'
            }
        }
    };

    render() {
        return (
            <>
                <div className={styles.canvas}
                     onWheel={(e) => this.handleWheel(e)}
                     style={this.transformScale()}
                >
                    <div  id='getBanner' className={styles.transparentCanvas}
                         onMouseUp={(e) => this.handleMouseUp(e)}
                         onMouseDown={(e) => this.handleMouseDown(e)}
                         onMouseMove={(e) => this.handleMouseMove(e)}
                         style={this.transformPosition()}
                    >
                        <div className={styles.bannerWrapper}
                             style={this.getBannerSizes()}
                        >
                            <div className={styles.background} style={this.addBackground(this.props.bannerBackground.background)}>
                                {
                                    this.props.layers.layers && this.props.layers.layers.map((el, i) => {
                                        return (
                                            <div key={i} style={{
                                                position: 'absolute', 
                                                fontSize: `${el.size}px`,
                                                top: `${el.top}px`,
                                                left: `${el.left}px`
                                                }}>
                                                {el.name}
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        bannerSize: state.bannerSize,
        bannerBackground: state.bannerBackground,
        layers: state.layers
    };
};

const mapDispatchToProps = (dispatch) => ({
    changeHeight: (height) => dispatch(changeHeight(height)),
    changeWidth: (width) => dispatch(changeWidth(width))
});

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);