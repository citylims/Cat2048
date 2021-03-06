'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BoardView = function (_React$Component) {
  _inherits(BoardView, _React$Component);

  function BoardView(props) {
    _classCallCheck(this, BoardView);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BoardView).call(this, props));

    _this.state = { board: new Board() };
    return _this;
  }

  _createClass(BoardView, [{
    key: 'restartGame',
    value: function restartGame() {
      this.setState({ board: new Board() });
    }
  }, {
    key: 'handleKeyDown',
    value: function handleKeyDown(event) {
      if (this.state.board.hasWon()) {
        return;
      }
      if (event.keyCode >= 37 && event.keyCode <= 40) {
        event.preventDefault();
        var direction = event.keyCode - 37;
        this.setState({ board: this.state.board.move(direction) });
      }
    }
  }, {
    key: 'handleTouchStart',
    value: function handleTouchStart(event) {
      if (this.state.board.hasWon()) {
        return;
      }
      if (event.touches.length != 1) {
        return;
      }
      this.startX = event.touches[0].screenX;
      this.startY = event.touches[0].screenY;
      event.preventDefault();
    }
  }, {
    key: 'handleTouchEnd',
    value: function handleTouchEnd(event) {
      if (this.state.board.hasWon()) {
        return;
      }
      if (event.changedTouches.length != 1) {
        return;
      }
      var deltaX = event.changedTouches[0].screenX - this.startX;
      var deltaY = event.changedTouches[0].screenY - this.startY;
      var direction = -1;
      if (Math.abs(deltaX) > 3 * Math.abs(deltaY) && Math.abs(deltaX) > 30) {
        direction = deltaX > 0 ? 2 : 0;
      } else if (Math.abs(deltaY) > 3 * Math.abs(deltaX) && Math.abs(deltaY) > 30) {
        direction = deltaY > 0 ? 3 : 1;
      }
      if (direction != -1) {
        this.setState({ board: this.state.board.move(direction) });
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      window.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('keydown', this.handleKeyDown.bind(this));
    }
  }, {
    key: 'render',
    value: function render() {
      var cells = this.state.board.cells.map(function (row, rowIndex) {
        return React.createElement(
          'div',
          { key: rowIndex },
          row.map(function (_, columnIndex) {
            return React.createElement(Cell, { key: rowIndex * Board.size + columnIndex });
          })
        );
      });
      var tiles = this.state.board.tiles.filter(function (tile) {
        return tile.value != 0;
      }).map(function (tile) {
        return React.createElement(TileView, { tile: tile, key: tile.id });
      });
      return React.createElement(
        'div',
        { className: 'board', onTouchStart: this.handleTouchStart.bind(this), onTouchEnd: this.handleTouchEnd.bind(this), tabIndex: '1' },
        cells,
        tiles,
        React.createElement(GameEndOverlay, { board: this.state.board, onRestart: this.restartGame.bind(this) }),
        React.createElement(Scoreboard, { board: this.state.board, onRestart: this.restartGame.bind(this) })
      );
    }
  }]);

  return BoardView;
}(React.Component);

;

var Cell = function (_React$Component2) {
  _inherits(Cell, _React$Component2);

  function Cell() {
    _classCallCheck(this, Cell);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Cell).apply(this, arguments));
  }

  _createClass(Cell, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      return false;
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'span',
        { className: 'cell' },
        ''
      );
    }
  }]);

  return Cell;
}(React.Component);

;

var TileView = function (_React$Component3) {
  _inherits(TileView, _React$Component3);

  function TileView() {
    _classCallCheck(this, TileView);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(TileView).apply(this, arguments));
  }

  _createClass(TileView, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      if (this.props.tile != nextProps.tile) {
        return true;
      }
      if (!nextProps.tile.hasMoved() && !nextProps.tile.isNew()) {
        return false;
      }
      return true;
    }
  }, {
    key: 'render',
    value: function render() {
      var tile = this.props.tile;
      var classArray = ['tile'];
      classArray.push('tile' + this.props.tile.value);
      if (!tile.mergedInto) {
        classArray.push('position_' + tile.row + '_' + tile.column);
      }
      if (tile.mergedInto) {
        classArray.push('merged');
      }
      if (tile.isNew()) {
        classArray.push('new');
      }
      if (tile.hasMoved()) {
        classArray.push('row_from_' + tile.fromRow() + '_to_' + tile.toRow());
        classArray.push('column_from_' + tile.fromColumn() + '_to_' + tile.toColumn());
        classArray.push('isMoving');
      }
      var classes = classArray.join(' ');
      var catUrl = assignImage(tile.value);
      return React.createElement('img', { className: classes, src: catUrl });
    }
  }]);

  return TileView;
}(React.Component);

var assignImage = function assignImage(value) {
  var output;
  switch (value) {
    case 2:
      output = 'http://i.imgur.com/MkzMwUU.gif';break;
    case 4:
      output = 'http://i.imgur.com/9RbjTCX.gif';break;
    case 8:
      output = 'http://i.imgur.com/jNHH8A5.gif';break;
    case 16:
      output = 'http://i.imgur.com/MK1CPVy.gif';break;
    case 32:
      output = 'http://i.imgur.com/yS1wOAI.gif';break;
    case 64:
      output = 'http://i.imgur.com/HJ3Zzm1.gif';break;
    case 128:
      output = 'http://i.imgur.com/U8ZYXSU.gif';break;
    case 256:
      output = 'http://i.imgur.com/ekulTtX.gif';break;
    case 512:
      output = 'http://i.imgur.com/hvkvYjc.gif';break;
    case 1024:
      output = 'http://i.imgur.com/Mjc0ddH.gif';break;
    case 2048:
      output = 'http://i.imgur.com/rH6HG5e.gif';break;
  }
  return output;
};

var GameEndOverlay = function GameEndOverlay(_ref) {
  var board = _ref.board;
  var onRestart = _ref.onRestart;

  var contents = '';
  if (board.hasWon()) {
    contents = 'Good Job!';
  } else if (board.hasLost()) {
    contents = 'Game Over';
  }
  if (!contents) {
    return null;
  }
  return React.createElement(
    'div',
    { className: 'overlay' },
    React.createElement(
      'p',
      { className: 'message' },
      contents
    ),
    React.createElement(
      'button',
      { className: 'tryAgain', onClick: onRestart, onTouchEnd: onRestart },
      'Try again'
    )
  );
};

var Scoreboard = function Scoreboard(_ref2) {
  var board = _ref2.board;
  var onRestart = _ref2.onRestart;

  if (!board) return;
  return React.createElement(
    'div',
    { className: 'scoreboard' },
    React.createElement(
      'h1',
      { className: 'score total' },
      'Score: ',
      board.total
    ),
    React.createElement(
      'h1',
      { className: 'score highscore' },
      'HighScore: ',
      board.highScore
    )
  );
};

ReactDOM.render(React.createElement(BoardView, null), document.getElementById('boardDiv'));