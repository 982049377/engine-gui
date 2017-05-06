import * as path from 'path';
import * as fs from 'fs';

export let run = () => {
    let canvas = document.getElementById("bookstore") as HTMLCanvasElement;
    let stage = engine.run(canvas);

    let date: any;
    let bookArry: bookResource[] = []
    let bookitems: bookItem[] = [];

    let projectUserPck = path.resolve(__dirname, "../../");
    let configPath = path.join(projectUserPck, "date.config")

    if (!fs.existsSync(configPath))
        alert("不是有效路径")
    else {
        let dateContent = fs.readFileSync(configPath, "UTF-8");
        try {
            date = JSON.parse(dateContent);
        }
        catch (e) {
            alert("解析JSON文件出现问题");
        }
        if (date) {
            bookArry = date.reource;
            for (var i = 0; i < bookArry.length; i++) {
                let bookitem = new bookItem(bookArry[i].name, bookArry[i].id, i);
                bookitems.push(bookitem);
            }
        }
    }

    //加入舞台
    let y =0;
    for (var bookitem of bookitems) {
        bookitem.x=0;
        bookitem.y=y;
        y+=5;
        stage.addChild(bookitem);
    }
}

class bookResource {
    name: string;
    id: string;
    constructor(name: string, id: string) {
        this.name = name;
        this.id = id;
    }
}

class bookItem extends engine.DisplayObjectContainer {
    book: bookResource;
    index: number;
    desc: engine.TextField;
    constructor(bookname: string, id: string, index: number) {
        super();
        this.book = new bookResource(name, id);
        this.index = index;
        this.desc = new engine.TextField();
        this.desc.text = name + "   " + id;
    }


}