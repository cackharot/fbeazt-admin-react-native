import React, {Component, PropTypes} from "react";
import {StyleSheet, View, Text, TouchableWithoutFeedback} from "react-native";
import { typography, color } from 'react-native-material-design-styles';
import { Ripple } from 'react-native-material-design';

const TYPO = typography;

export class List extends Component {

    static propTypes = {
        primaryText: PropTypes.string.isRequired,
        secondaryText: PropTypes.string,
        captionText: PropTypes.string,
        secondaryTextMoreLine: PropTypes.arrayOf(PropTypes.shape({
            text: PropTypes.element.isRequired,
            style: PropTypes.object
        })),
        leftIcon: PropTypes.element,
        rightIcon: PropTypes.element,
        leftAvatar: PropTypes.element,
        rightAvatar: PropTypes.element,
        lines: PropTypes.number,
        primaryColor: PropTypes.string,
        onPress: PropTypes.func,
        onLeftIconClick: PropTypes.func,
        onRightIconClick: PropTypes.func,
        captionStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
        style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    };

    static defaultProps = {
        lines: 1,
        primaryColor: 'rgba(0,0,0,.87)',
        style: {},
        captionStyle: {}
    };

    render() {
        const {
            primaryText,
            secondaryText,
            leftIcon,
            leftAvatar,
            rightAvatar,
            rightIcon,
            lines,
            onPress,
            primaryColor,
            onLeftIconClicked,
            onRightIconClicked,
            secondaryTextMoreLine,
            captionText,
            style,
            captionStyle
        } = this.props;

        return (
            <View style={[styles.listContainer, { marginTop: 1, height: lines > 2 ? ((lines - 1) * 18 + 56) : (secondaryText ? 72 : (leftAvatar || rightAvatar) ? 56 : 48) }, style]}>
                {leftIcon &&
                    <TouchableWithoutFeedback onPress={onLeftIconClicked}>
                        <View style={[styles.leftIcon, lines > 2 && { paddingTop: 16, alignSelf: 'flex-start' }]}>
                            {leftIcon}
                        </View>
                    </TouchableWithoutFeedback>
                }
                {leftAvatar &&
                    <Ripple onPress={onLeftIconClicked}>
                        <View style={[styles.leftAvatar, lines > 2 && { paddingTop: 0, alignSelf: 'flex-start' }]}>
                            {leftAvatar}
                        </View>
                    </Ripple>
                }
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View style={styles.firstLine}>
                        <View style={styles.primaryTextContainer}>
                            <Text numberOfLines={1} style={[styles.primaryText, { color: primaryColor }]}>
                                {primaryText}
                            </Text>
                        </View>
                        {(!!rightIcon) ||
                            <View style={styles.captionTextContainer}>
                                <Text style={[styles.captionText, captionStyle]}>
                                    {captionText}
                                </Text>
                            </View>
                        }
                    </View>
                    {secondaryText &&
                        <View>
                            <Text style={[{ height: 18 }, lines > 2 && { height: 22 * (lines - 1) - 4 }, styles.secondaryText]}>
                                {secondaryText}
                            </Text>
                        </View>
                    }
                    {secondaryTextMoreLine &&
                        <View style={[{ height: 18 }, lines > 2 && { height: 22 * (lines - 1) - 4 }]}>
                            {secondaryTextMoreLine.map((line, i) => (
                                <Text key={i} style={[styles.secondaryText, { height: 22 }, line.style]}>
                                    {line.text}
                                </Text>
                            )) }
                        </View>
                    }
                </View>

                {rightAvatar &&
                    <View
                        style={[styles.rightAvatar, lines > 2 && {
                            paddingTop: 16,
                            alignSelf: 'flex-start'
                        }]}
                        >
                        {rightAvatar}
                    </View>
                }
                <View style={{ flexDirection: 'column' }}>
                    {!!rightIcon && !!captionText &&
                        <View style={styles.captionTextContainer2}>
                            <Text style={[styles.captionText, captionStyle]}>{captionText}</Text>
                        </View>}

                    {rightIcon &&
                        <Ripple onPress={onRightIconClicked}>
                            <View
                                style={[styles.rightIcon, { flex: 1 }, {
                                    alignSelf: 'flex-end',
                                    justifyContent: 'flex-end'
                                }]}
                                onPress={onRightIconClicked}
                                >
                                {rightIcon}
                            </View>
                        </Ripple>
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    listContainer: {
        flexDirection: 'row',
        paddingLeft: 16,
        paddingRight: 16,
        height: 48,
        alignItems: 'center'
    },
    leftIcon: {
        width: 56,
        position: 'relative',
        top: -6
    },
    rightIcon: {
        // paddingLeft: 10,
        position: 'relative',
        top: 0,
        right: 0
    },
    leftAvatar: {
        width: 56
    },
    rightAvatar: {
        width: 56
    },
    primaryText: Object.assign({}, TYPO.paperFontSubhead, { lineHeight: 24 }),
    secondaryText: Object.assign({}, TYPO.paperFontBody1, {
        lineHeight: 22,
        fontSize: 14,
        color: 'rgba(0,0,0,.54)'
    }),
    firstLine: {
        flexDirection: 'row'
    },
    primaryTextContainer: {
        flex: 1,
        paddingRight: 16
    },
    captionTextContainer: {
        alignSelf: 'flex-start',
        alignItems: 'flex-start'
    },
    captionText: Object.assign({}, TYPO.paperFontCaption),
    captionTextContainer2: {
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
    }
});
// color: '#268bd2'
