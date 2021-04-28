import {Colors,Layout} from '../../constants/';
export default {
  itemStyle:{
    marginLeft:0
  },
  loginBox: {
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    flex: 1,
  },
  loginwelcome: {
    fontSize:30,
    alignSelf: 'stretch',
    textAlign:'center',
    textTransform:'capitalize',
    color:'#666666', marginTop: Layout.indent,
  },
  linkTextBtn:{
    marginBottom:Layout.indent
  },
  linkText:{
    textTransform:'capitalize',
    color: '#002DB3',
    alignSelf: 'stretch',
    fontSize:16,
  },
  loginbutton: {
    height: 80, marginTop:Layout.indent, 
  },
  loginbuttontext: {
     borderRadius:10,
  },
  logintext: {
     fontSize:22,
    textTransform:'capitalize',
  },
  loginForm:{
    paddingRight:Layout.indent
  },
  loginboxarea: {
    backgroundColor:'#ffffff', marginTop: Layout.doubleIndent, marginRight:20, marginLeft:20, borderRadius:10, width: Layout.window.width * 0.90, borderRadius:5,
          shadowColor: 'black',overflow: "hidden",alignShelf:'center', alignItem:'center', justifyContent:'center',
shadowOpacity: 0.9,
elevation: 6,
shadowRadius: 20 ,
shadowOffset : { width: 56, height: 13},
  },
};