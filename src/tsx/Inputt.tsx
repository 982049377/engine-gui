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
            index: -1,
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
    Changeindex = (event) => {
        this.setState({
            index: event.target.value
        })
    }
    Changedesc = (event) => {
        this.setState({
            desc: event.target.value
        })
    }
    SubmitInfor = () => {
        var bookitem = new bookView(this.state.name, this.state.id, this.state.index, this.state.desc);
        this._bookStore.addOrChangeBook(bookitem);
    }
    timerout: any;
    refresh: boolean = false;
    componentDidMount() {
        this.timerout = setInterval(() => {
            this.IsDisplay = BookStore.hasBookOptionBar;
            if (this.IsDisplay && !this.refresh) {
                this.forceUpdate();
                this.refresh = true;
            }
            if (!this.IsDisplay&& this.refresh) {
                this.forceUpdate();
                this.refresh = false;
            }
        }, 100);
    }
    IsDisplay: boolean;

    componentWillUnmount() {
        clearInterval(this.timerout);
    }
    render() {
        this.IsDisplay = BookStore.hasBookOptionBar;
        // var IsDisplay = true;
        console.log("render");
        if (this.IsDisplay) {
            return (
                <div>
                    <li>BookName:{this.state.name}</li><input type='text' value={this.state.name} onChange={this.ChangeName.bind(this)} />
                    <li>BookID:{this.state.id}</li><input type='text' value={this.state.id} onChange={this.ChangeId} />
                    <li>BookIndex:{this.state.index}</li><input type='text' value={this.state.index} onChange={this.Changeindex} />
                    <li>BookDesc:{this.state.desc}</li><input type='text' value={this.state.desc} onChange={this.Changedesc} />
                    <button value="submit" style={{ width: 50, height: 50 }} onClick={this.SubmitInfor} ></button>
                </div>
            )
        }
        else
            return (<div />);
    }
}

export default InputField;