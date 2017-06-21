import * as React from 'react';
import { bookResource, bookView, BookStore } from '../renderer/a';

class InputField extends React.Component<any, any>{
    private _bookStore: BookStore;
    constructor(props) {
        super(props);
        this._bookStore = BookStore.getInstance();
        this.state = {
            name: '',
            id: '',
            // index: -1,
            desc: '书籍'
        }
    }
    ChangeId = (event) => {
        this.setState({
            id: event.target.value
        })
    }
    ChangeName(event) {
        this.setState({
            name: event.target.value
        })
    }
    Changedesc = (event) => {
        this.setState({
            desc: event.target.value
        })
    }
    SubmitInfor = () => {
        var bookitem = new bookView(this.state.name, this.state.id, null, this.state.desc);
        this._bookStore.addOrChangeBook(bookitem);
    }
    timerout: any;
    // refresh: boolean = false;
    componentDidMount() {
        this.timerout = setInterval(() => {
            this.Isadd = BookStore.optionBar.IsAdd;
            this.IsChange = BookStore.optionBar.IsChange;
            if ((this.Isadd || this.IsChange) ) {
                this.forceUpdate();
                // this.refresh = true;
            }
            if (!(this.Isadd || this.IsChange) ) {
                this.forceUpdate();
                // this.refresh = false;
            }
        }, 100);
    }
    Isadd: boolean = false;
    IsChange: boolean = false;
    componentWillUnmount() {
        clearInterval(this.timerout);
    }
    render() {
        // this.Isadd = BookStore.hasBookOptionBar;
        // this.IsChange = BookStore.hasBookOptionBar;
        // var IsDisplay = true;
        // console.log("render");
        if (this.Isadd) {
            return (
                <div>
                    <li>BookName:</li><input type='text' value={this.state.name} onChange={this.ChangeName.bind(this)} />
                    <li>BookID:</li><input type='text' value={this.state.id} onChange={this.ChangeId} />
                    <li>BookDesc:</li><input type='text' value={this.state.desc} onChange={this.Changedesc} />
                    <button value="submit" style={{ width: 50, height: 50 }} onClick={this.SubmitInfor} ></button>
                </div>
            )
        }
        if (this.IsChange)
            return (
                <div>
                    <li>BookName:</li><input type='text' value={this.state.name} onChange={this.ChangeName.bind(this)} />
                    <li>BookID:<a style={{color:'#EA0000'}}>{BookStore.optionBar.getbook().id}</a></li>
                    <li>BookDesc:</li><input type='text' value={this.state.desc} onChange={this.Changedesc} />
                    <button value="submit" style={{ width: 30, height: 30 }} onClick={this.SubmitInfor} ></button>
                </div>
            )
        return (<div />);
    }
}

export default InputField;