function BBSCore() {
  this.strUtil = new StrUtil();
  this.prefs = new PrefsHandler(this);
  this.prefs.loadPrefs();
  this.conn = null;
  this.buf = new TermBuf(this, 80, 24);
  this.view = new TermView(this, this.buf);
  this.parser = new AnsiParser(this.buf);
  this.robot = null;
  this.connectionStatusEventNotify = [];
  this.applyDataEvent = null;
}

BBSCore.prototype={

  connect: function(site, port) {
    this.conn.connect(site, port);
  },

  close: function() {

  },

  onConnect: function(conn) {

  },

  onData: function(conn, data) {
    this.parser.feed(data);
  },

  onClose: function(conn) {
    //alert('onClose');
  },

  resetUnusedTime: function() {

  },

  addTask: function(taskName, callback, extData) {
    if(taskName in this.robot) {
      this.robot.addTask(
        {
          name: taskName,
          run: this.robot[taskName].bind(this.robot),
          callback: callback,
          extData: extData
        }
      );
    }
  },
  
  login: function(site, username, password, savePassword) {
    var siteData = window.siteManager.getSite(site);
    this.prefs.setRoot( siteData.prefsRoot );    
    //this.buf.setCol(siteData.col);
    //this.buf.setCol(siteData.row);

    if(this.conn && siteData.protocol != this.conn.protocolName) {
      //this.conn.release();
      this.conn = null;
    }
    if(!this.conn) {
      if(siteData.protocol == 'telnet') {
        this.conn = new TelnetProtocol(this);
      } else if(siteData.protocol == 'ssh') {
        this.conn = new SshProtocol(this);
      }
    }
    
    if(this.robot && siteData.name != site) {
      this.robot = null;
    }
    if(!this.robot)
      this.robot = new siteData.Robot(this);   

    if(savePassword) {
      this.prefs.saveUsernameAndPassword(username, password);
    } else {
      this.prefs.removeUsernameAndPassword();
    }
    this.prefs.loginStr[1] = username;
    this.prefs.loginStr[2] = password;
    this.addTask('login', this.onLoginEvent.bind(this));
    this.connect(siteData.addr, siteData.port);
  },
  
  getFavorite: function() {
    if('getFavorite' in this.robot) {
      return this.robot.getFavorite();
    }
    return null;
  },
  
  logout: function() {
    this.addTask('logout', this.onLogoutEvent.bind(this));
  },

  onLoginEvent: function(status, message){
    for(var i=0;i<this.connectionStatusEventNotify.length;++i){
      this.connectionStatusEventNotify[i](status, message);
    }
  },

  onLogoutEvent: function(data){
    for(var i=0;i<this.connectionStatusEventNotify.length;++i){
      this.connectionStatusEventNotify[i]('logout');
    }
  },

  regConnectionStatusEvent: function(eventCallback) {
    this.connectionStatusEventNotify.push(eventCallback);
  },

  setApplyDataEvent: function(eventCallback) {
    this.applyDataEvent = eventCallback;
  },  
  
  apply: function(subject, obj) {
    this.applyDataEvent(subject, obj);    
  }

};
