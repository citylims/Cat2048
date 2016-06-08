class BoardView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {board: new Board};
  }
  restartGame() {
    this.setState({board: new Board});
  }
  handleKeyDown(event) {
    if (this.state.board.hasWon()) {
      return;
    }
    if (event.keyCode >= 37 && event.keyCode <= 40) {
      event.preventDefault();
      var direction = event.keyCode - 37;
      this.setState({board: this.state.board.move(direction)});
    }
  }
  handleTouchStart(event) {
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
  handleTouchEnd(event) {
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
      this.setState({board: this.state.board.move(direction)});
    }
  }
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }
  render() {
    var cells = this.state.board.cells.map((row, rowIndex) => {
      return (
        <div key={rowIndex}>
          { row.map((_, columnIndex) => <Cell key={rowIndex * Board.size + columnIndex} />) }
        </div>
      );
    });
    var tiles = this.state.board.tiles
      .filter(tile => tile.value != 0)
      .map(tile => <TileView tile={tile} key={tile.id} />);
    return (
      <div className='board' onTouchStart={this.handleTouchStart.bind(this)} onTouchEnd={this.handleTouchEnd.bind(this)} tabIndex="1">
        {cells}
        {tiles}
        <GameEndOverlay board={this.state.board} onRestart={this.restartGame.bind(this)} />
        <Scoreboard board={this.state.board} onRestart={this.restartGame.bind(this)} />
      </div>
    );
  }
};

class Cell extends React.Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    return (
      <span className='cell'>{''}</span>
    );
  }
};

class TileView extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.tile != nextProps.tile) {
      return true;
    }
    if (!nextProps.tile.hasMoved() && !nextProps.tile.isNew()) {
      return false;
    }
    return true;
  }
  render() {
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
    return (
      <img className={classes} src={catUrl}/>
    );
  }
}

var assignImage = function(value) {
  var output;
  switch(value) {
    case 2: output = 'http://i.imgur.com/MkzMwUU.gif'; break;
  	case 4: output = 'http://i.imgur.com/9RbjTCX.gif'; break;
    case 8: output = 'http://i.imgur.com/jNHH8A5.gif'; break;
    case 16: output = 'http://i.imgur.com/MK1CPVy.gif'; break;
    case 32: output = 'http://i.imgur.com/yS1wOAI.gif'; break;
    case 64: output = 'http://i.imgur.com/HJ3Zzm1.gif'; break;
    case 128: output = 'http://i.imgur.com/U8ZYXSU.gif'; break;
    case 256: output = 'http://i.imgur.com/ekulTtX.gif'; break;
    case 512: output = 'http://i.imgur.com/hvkvYjc.gif'; break;
    case 1024: output = 'http://i.imgur.com/Mjc0ddH.gif'; break;
    case 2048: output = 'http://i.imgur.com/rH6HG5e.gif'; break;
  }
  return output
}	 

var GameEndOverlay = ({board, onRestart}) => {
  var contents = '';
  if (board.hasWon()) {
    contents = 'Good Job!';
  } else if (board.hasLost()) {
    contents = 'Game Over';
  }
  if (!contents) {
    return null;
  }
  return (
    <div className='overlay'>
      <p className='message'>{contents}</p>
      <button className="tryAgain" onClick={onRestart} onTouchEnd={onRestart}>Try again</button>
    </div>
  );
};

var Scoreboard = ({board, onRestart}) => {
  console.log(board);
  if (!board) return;
  return (
    <div className='scoreboard'> 
      <h1 className='score total'>Score: {board.total}</h1>
      <h1 className='score highscore'>HighScore: {board.highScore}</h1>
    </div>
  )
};

ReactDOM.render(<BoardView />, document.getElementById('boardDiv'));
