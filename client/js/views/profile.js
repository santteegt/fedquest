this.ProfileView = Backbone.View.extend({
  template: null,
  tagName: "div",
  id: "profile",
  initialize: function(lan) {
    var me;
    me = this;
    
  },
  render: function() {
   var profthis = this;
  
    if (!_.isNull(Meteor.userId()) ){
    Blaze.render(Template.profile, $('#sparql-content')[0]);
    profthis.setEvents($('#sparql-content'));
     
    loadProfile();
    waitingDialog.show();
    return profthis;
     } else {
     window.open('/error',"_self" );
     return null;

    }
    

  } , 
  setEvents: function (divNode) {
 $('.combobox').combobox();



  }

 
   

});


profileSend = function () {
    var name =  $("input:text[id='name']").val ();
    var dir =  $("input:text[id=dir]").val ();
    var email =  $("input[id='email']").val ();
 //   var pwd =  $("input[id=pwd]").val ();
    var lan =  $("select[id=language]").val();
    var lev =  $("select[id=level]").val();
    var area = $('#area-checkbox input:checkbox:checked').map(function(){
      return  parseInt($(this).val());
    }).get();
    var access =  $("select[id=accessLevel]").val();
    //.val() ;
    /*$("#find-table input:checkbox:checked").map(function(){
      return $(this).val();
    }).get();*/

 /*console.log (name+dir+email+pwd+lan+level);*/
  // alert (Meteor.userId()+name+dir+email+pwd+lan+lev+area);


/*
  var options = {
    username: email,
    emails: [{
        address: email,
        verified: false
    }],
    password:  pwd,
    profile: {
        surname: name ,
        lang : lan
    },
    };

   Accounts.createUser( options , function(err){
    alert("Datos Actualizados");
    if( err ) $('div#errors').html( err.message );
     });*/


    var result = Meteor.call('SaveProfile', Meteor.userId() , name , dir , parseInt(lev) , area , lan , "" , email , parseInt(access) ,function (error, result) {
      
     alert(result);
     //console.log (Meteor.userId());
    });


    
};

function loadProfile (){
   var result = Meteor.call('findProfile', Meteor.userId() ,function (error, result) {
        // FromList.push({attributes:{"data-base": true , "data-endpoint": result.endpoint , "data-graphuri" : result.graphURI }}) ;
        
       if (!_.isUndefined(result)) {
                   
               

        $("input:text[id='name']").val(result.nameUser);
        $("input:text[id=dir]").val(result.direction);
         $("select[id=level]").val(result.levelAcademic);
         $("input[id='email']").val (Meteor.user().emails[0].address);
    //     $("input[id=pwd]").val (result.password);
         $("select[id=language]").val(result.language);
         $("select[id=accessLevel]").val(result.accessLevel);
     //    console.log ("Dis");
     //   $("select[id=accessLevel]").attr("disabled","");
    /*    $("select#accessLevel>option[value=0]").attr("disabled","");
        _.each($("select#accessLevel>option"), function (opt){
            
        });*/
        _.each($("select#accessLevel>option"), function (opt){
         if (opt.value>result.accessLevel){$("select#accessLevel>option[value ="+opt.value+"]").attr("disabled","disabled");}
        });

         console.log (result.accessLevel);
          var area = result.areasInterest;
         var area = $('#area-checkbox input:checkbox').map(function(){
        

             if ( jQuery.inArray(  parseInt($(this).val()), area ) != -1 )
              {
                     $(this).attr('checked','checked');
              }
         
         //$(this).val(0);
         });
           
        
    //   console.log (result);
      }
       waitingDialog.hide();
 
    });
      // return result;
    };