//图书导航栏
import React from "react";
import "./navigationPanel.css";
import { connect } from "react-redux";
import ContentList from "../contentList/contentList";
import BookmarkList from "../bookmarkList/boomarkList";
import { handleFetchBookmarks } from "../../redux/actions/reader";
import ReadingTime from "../../utils/readingTime";
import BookModel from "../../model/Book";
import BookmarkModel from "../../model/Bookmark";
import { stateType } from "../../redux/store";
import { Trans } from "react-i18next";
import { withNamespaces } from "react-i18next";

export interface NavigationPanelProps {
  currentEpub: any;
  currentBook: BookModel;
  bookmarks: BookmarkModel[];
  handleFetchBookmarks: () => void;
}

export interface NavigationPanelState {
  isContentShow: boolean;
  chapters: any;
  cover: string;
  time: number;
}

class NavigationPanel extends React.Component<
  NavigationPanelProps,
  NavigationPanelState
> {
  timer: any;
  constructor(props: NavigationPanelProps) {
    super(props);
    this.state = {
      isContentShow: true,
      chapters: [],
      cover: "",
      time: ReadingTime.getTime(this.props.currentBook.key),
    };
    this.timer = null;
  }
  componentDidMount() {
    this.timer = setInterval(() => {
      let time = this.state.time;
      time += 1;
      this.setState({ time });
    }, 1000);
    this.props.currentEpub
      .coverUrl()
      .then((url: string) => {
        this.setState({ cover: url });
      })
      .catch(() => {
        console.log("Error occurs");
      });
    this.props.handleFetchBookmarks();
  }
  componentWillUnmount() {
    clearInterval(this.timer);
    ReadingTime.setTime(this.props.currentBook.key, this.state.time);
  }

  handleClick = (isContentShow: boolean) => {
    this.setState({ isContentShow });
  };

  render() {
    return (
      <div className="navigation-panel">
        <div className="navigation-header">
          <img className="book-cover" src={this.state.cover} alt="" />
          <div className="book-title-container">
            <p className="book-title">{this.props.currentBook.name}</p>
          </div>

          <p className="book-arthur">
            <Trans>Author</Trans>:{" "}
            <Trans>
              {this.props.currentBook.author
                ? this.props.currentBook.author
                : "Unknown"}
            </Trans>
          </p>
          <span className="reading-duration">
            <Trans>Reading Time</Trans>: {Math.floor(this.state.time / 60)}
            &nbsp;
            <Trans>Minute</Trans>
          </span>

          <div className="navigation-navigation">
            <span
              className="book-content-title"
              onClick={() => {
                this.handleClick(true);
              }}
              style={
                this.state.isContentShow
                  ? { color: "rgba(112, 112, 112, 1)" }
                  : { color: "rgba(217, 217, 217, 1)" }
              }
            >
              <Trans>Content</Trans>
            </span>
            <span
              className="book-bookmark-title"
              style={
                this.state.isContentShow
                  ? { color: "rgba(217, 217, 217, 1)" }
                  : { color: "rgba(112, 112, 112, 1)" }
              }
              onClick={() => {
                this.handleClick(false);
              }}
            >
              <Trans>Bookmark</Trans>
            </span>
          </div>
        </div>
        <div className="navigation-body-parent">
          <div className="navigation-body">
            {this.state.isContentShow ? (
              <ContentList />
            ) : this.props.bookmarks !== null ? (
              <BookmarkList />
            ) : (
              <div className="navigation-panel-empty-bookmark">
                <Trans>Empty</Trans>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state: stateType) => {
  return {
    currentEpub: state.book.currentEpub,
    currentBook: state.book.currentBook,
    bookmarks: state.reader.bookmarks,
  };
};
const actionCreator = { handleFetchBookmarks };
export default connect(
  mapStateToProps,
  actionCreator
)(withNamespaces()(NavigationPanel as any));