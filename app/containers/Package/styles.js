import {Colors,Layout} from '../../constants/';
export default {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headertitle: { backgroundColor:Colors.primaryDark},
  headertitletext: {fontSize:14, padding: 10, color:Colors.white, textAlign:'center',},
  topbaricons: {fontSize:20, color:Colors.white, },


 
  contentsection: {fontSize:22, padding: Layout.indent,},
  pagetitle: {fontSize:18, padding: Layout.indent, paddingBottom:Layout.indent, color:Colors.primary, textAlign:'center' },
  boxcontentarea: {backgroundColor:Colors.white, marginRight: Layout.indent, width:170, minHeight:140, borderWidth:1, borderColor:'#ededed'},
  boxcontentareagrid: {backgroundColor:Colors.white, marginRight: Layout.indent, marginBottom: Layout.indent, width:170, minHeight:140, borderWidth:1, borderColor:'#ededed'},
  contentspacingtext:{ padding: Layout.indent, paddingTop:5,},
  datetitle: {fontSize:17, color:Colors.commoncolor, marginLeft:10},
  positiontitle: {fontSize:13, color:Colors.commoncolor,},
  pricetitle: {fontSize:15, color:Colors.primary, marginTop:5,},
  scrollViewStyle: {
        justifyContent: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
    },
  topspacing: {marginTop:Layout.doubleIndent},
    filtericon: {
    width:'auto', height:175,
  },
  imagesection: {
    width:'auto', height:170,
  	resizeMode: 'cover',
  },


  symbolgreen: {
      width: 14,
      height: 14,
      borderRadius: 14/2,
      backgroundColor: 'green',
      position: 'absolute', borderWidth:2, borderColor:'#ffffff',
      left: 10,
      top: 10,
    },
    livechat: { backgroundColor:Colors.primary, fontSize:12, padding:5, justifyContent:'center', marginTop:Layout.indent, borderRadius:5, alignItems:'center'},
    livetext: { backgroundColor:Colors.primary, fontSize:12, padding:5, marginLeft:5, alignItems:'center', borderRadius:5, marginTop:Layout.indent,},
    iconstitle: { fontSize:11, color:Colors.white, justifyContent:'center'}

};