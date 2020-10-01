import 'dart:async';
import 'dart:collection';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:http/http.dart' as http;

final baseURL = 'https://script.google.com/macros/s/AKfycbycDYx2WMPYk7enunUNTUl80iJmiRknaHL_Z7_MNoec4FANngw/exec?';
final LinkedHashMap<String, int> values = new LinkedHashMap();

void main() async{
  await getValues();
  runApp(HateJar());
}

getValues() async{
  var response = await http.get( baseURL + 'action=getAll' );
  // reverse to put newest entries at the top
  for( String row in new List.from( response.body.trim().split('\n').reversed )){
    values[ row.split('\t')[0] ] = int.parse(row.split('\t')[1]);
  }
}

class HateJar extends StatelessWidget {

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Hate Jar',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: Page(title: 'Hate Jar - press the button to add a new card, or click a card to increase the hate level'),
    );
  }
}

class Page extends StatefulWidget {
  Page({Key key, this.title}) : super(key: key);
  final String title;
  @override
  PageState createState() => PageState();
}

class PageState extends State<Page> {

  TextEditingController controller = new TextEditingController();
  int hovered = -1;

  PageState(){
    // get new values from the server
    Timer.periodic(Duration(seconds: 10), (timer) {
      setState(() => getValues());
    });
  }

  void addItem( String newValue ) async{
    var response = await http.get( baseURL + 'action=add&value=' + newValue.trim() );
    controller.clear();
    setState(() {
      String value = response.body.split('\t')[0];
      int count = int.parse(response.body.split('\t')[1]);
      if(values.containsKey(value)){
        // If a card is clicked rapidly, the server calls can get behind.
        // Since the count only ever increases, only overwite with a higher number.
        if (values[value] < count) {
          values[value] = count;
        }
      }
      else{
        // this seems to be the simplest way to insert an item at the front of a LinkedHashMap
        LinkedHashMap<String, int> newMap = new LinkedHashMap();
        newMap[value] = count;
        newMap.addAll(values);
        values.clear();
        values.addAll(newMap);
      }
    });
  }

  void onOkPressed(){
    if( controller.text.trim().isNotEmpty ) {
      addItem(controller.text);
      Navigator.pop(context);
    }
  }

  void showAddDialog() async{

    Widget cancelButton = FlatButton(
        child: Text("Cancel"),
        onPressed: () => Navigator.pop(context)
    );
    Widget continueButton = FlatButton(
        child: Text("Continue"),
        onPressed: () => onOkPressed()
    );

    Widget alert = AlertDialog(
      title: Text("Add Card"),
      content: TextField(
        autofocus: true,
        controller: controller,
        onSubmitted: (value) => onOkPressed(),
      ),
      actions: [
        cancelButton,
        continueButton,
      ],
    );

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return alert;
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey,
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Padding(
        padding: EdgeInsets.all(10),
        child: GridView.count(
          crossAxisCount: (MediaQuery.of(context).size.width/300).round(),
          crossAxisSpacing: 10,
          mainAxisSpacing: 10,
          childAspectRatio: 2,
          children: List.generate(values.length, (index) {
            return Container(
                padding: EdgeInsets.all(10),
                decoration: BoxDecoration(
                  border: Border.all(width: 1.0, color: Colors.black),
                  color: Colors.white,
                  image: DecorationImage(
                    alignment: Alignment.topLeft,
                    scale: 2,
                    image: AssetImage("hated.png"),
                  ),
                ),
                child: new GestureDetector(
                    behavior: HitTestBehavior.opaque,
                    onTap: () {
                      addItem(values.keys.elementAt(index));
                      setState(() {
                        values[values.keys.elementAt(index)] = values.values.elementAt(index) + 1;
                      });
                    },
                    child: MouseRegion(
                        cursor: SystemMouseCursors.click,
                        onEnter: (event) => setState((){hovered = index;}),
                        onExit: (event) => setState((){hovered = -1;}),
                        child:Row(
                          children: <Widget>[
                            Expanded(
                                child: Center(
                                    child: Text(
                                        values.keys.elementAt(index),
                                        style: TextStyle(
                                          color: index==hovered ? Colors.red : Colors.black,
                                          fontSize: 25
                                      )
                                    )
                                )
                            ),
                            Column(
                              mainAxisAlignment: MainAxisAlignment.center, //Center Row contents horizontally,
                              children: [
                                Image.asset('finger.png', height: 70),
                                Center(
                                  child: Text(
                                    values.values.elementAt(index).toString(),
                                    style: TextStyle(
                                        fontSize: 20,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.red
                                    ),
                                  ),
                                )
                              ],
                            )
                          ],
                        )
                    )
                )
            );
          }),
        ),
      ),
      floatingActionButton: FloatingActionButton(
          elevation: 10.0,
          child: Icon(Icons.add),
          onPressed: () => showAddDialog()
      ),
    );
  }
}
