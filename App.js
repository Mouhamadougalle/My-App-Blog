import react from 'react';
import { render } from 'react-dom';
import './App.css';


class Page extends react.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 'blogs',
      server_response:'',
      logged_in: false,
      user:""
    };
  }

  handleSignup = (e) => {
    e.preventDefault();
    console.log(`user: ${e.target.username.value}`);
    let username = e.target.username.value;
    let password = e.target.password.value;
    let conf_password = e.target.conf_password.value;

    try {
     fetch('http://localhost:3001/signup', {
      method: 'POST',
      body: "username=" + username + "&password=" + password + "&conf_password=" + conf_password,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(res => res.text())
    .then(res => {this.setState({server_response:res})});
    } catch (err) {
      console.log("error!");
      console.log(err);
    }
  }

  handleLogin = (e) => {
    e.preventDefault();
    console.log(`user: ${e.target.username.value}`);
    let username = e.target.username.value;
    let password = e.target.password.value;

    try {
     fetch('http://localhost:3001/login', {
      method: 'POST',
      body: "username=" + username + "&password=" + password,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(res => res.text())
    .then(res => {
      if(res !== "Login successful") this.setState({server_response:res})
      else {
        this.setState({page:'blogs', server_response:'', logged_in:true, user:username})
      } // go to home if login successful
    });
    } catch (err) {
      console.log("error!");
      console.log(err);
    }
  }

  Addblog = (e) => {
    e.preventDefault();
    let title = e.target.title.value;
    let content = e.target.content.value;
    let author = this.state.user;
    // make date format in yyyy-mm-dd hh:mm:ss
    let date = new Date().toLocaleString('en-CA', {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'});


    fetch('http://localhost:3001/addblog', {
      method: 'POST',
      body: "title=" + title + "&content=" + content + "&author=" + author + "&date=" + date,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(res => res.text())
    .then(res => {
      if(res !== "Blog added") this.setState({server_response:res})
      else {
        this.setState({page:'blogs', server_response:''})
      } // go to home if login successful
    });
  }

  getBlogs = () => {
    fetch('http://localhost:3001/blogs')
    .then(res => res.json())
    .then(res => {
      return res;
    });
  }





  render() {
    return (
      <div>
        <nav>
          <ul>
            {/* Show login if not logged in*/}
            {!this.state.logged_in && <li><span onClick={(e)=>this.setState({page:'login', server_response:''})}>Login</span></li>}
            {!this.state.logged_in && <li><span onClick={(e)=>this.setState({page:'signup', server_response:''})}>Signup</span></li>}
            
            {/* Show other options */}
            {this.state.logged_in && <li> <span>{"Welcome, " + this.state.user} </span></li>}
            {this.state.logged_in && <li> <span onClick={(e)=>this.setState({page:'write_blog', server_response:''})}>write blog</span> </li>}


            <li><span onClick={(e)=>this.setState({page:'about_me', server_response:''})}>About Me</span></li>
            <li><span onClick={(e)=>this.setState({page:'blogs', server_response:''})}>Blogs</span></li>

          </ul>
        </nav>
        <div className="content">
          {this.state.page === 'login' && 
          <Login res={this.state.server_response} handleLogin={this.handleLogin} />}
          {this.state.page === 'signup' && 
          <Signup res={this.state.server_response} handleSubmit={this.handleSignup} />}
          {this.state.page === 'about_me' && <AboutMe />}
          {this.state.page === 'blogs' && <Blogs getBlogs={this.getBlogs} />}
          {this.state.page === 'write_blog' && <WriteBlog handleSubmit={this.Addblog}/>}
        </div>
      </div>
    );
  }
}




function Login (props){
    return (
      <form onSubmit={props.handleLogin}>
      <h1>Login</h1>
      <table>
        <tr>
          <td>Username</td>
          <td><input type="text" name="username" /></td>
        </tr>
        <tr>
          <td>Password</td>
          <td><input type="password" name="password" /></td>
        </tr>
      </table>  
      <div className={props.res === "Login successful"?"success":"error"}>
        {props.res}
      </div>
      <input type="submit"/>

      </form>
    );
}

function Signup (props){
    return (
      <form onSubmit={props.handleSubmit}>
      <h1>Signup</h1>
      <table>
        <tbody>
        <tr>
          <td>Username</td>
          <td><input type="text" name="username" /></td>
        </tr>
        <tr>
          <td>Password</td>
          <td><input type="password" name="password" /></td>
        </tr>
        <tr>
          <td>Confirm Password</td>
          <td><input type="password" name="conf_password" /></td>
        </tr>
        </tbody>
      </table>
      <div className={props.res === "Account created"?"success":"error"}>
        {props.res}
      </div>
      <input type="submit"/>
      </form>
    );
  }


function AboutMe(props){
  return (
    <div>
    <div className='aboutme'>
      {/* <img src='./aboutme.jpg' alt='Me'></img> */}
      <img src='https://images.pexels.com/photos/2375034/pexels-photo-2375034.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' alt='Me'></img>
      <p>
        Hello!! My name is Mouhamadou Diallo and i have created this blog to talk about ideas that are important to me and hopefully to you too.
        These topics can vary from science and Philosophy but also Politics and Sports. I will abord these topics with a different perspective. As an immigrant
        from Africa and also a United States Army Veteran i think my perspective will be valuable. I hope you guys enjoy my work here and please dont hesitate 
        to make a critic or give your feedback for things that need to be improved on.
      </p>
    </div>
    <center>  <a href="#" class="fa fa-facebook"></a>
        <a href="#" class="fa fa-twitter"></a>
        </center>
    </div>

  );
}

function Blogs(props){
  let blogs = props.getBlogs();    
  console.log(blogs);
  return (
    <div>
      <h1>Blogs</h1>
      <p className='blog_quote'>Read about the latest books</p>
      <img className='blogsImage' src='https://whytoread.com/wp-content/uploads/2014/05/philosophy_books.jpg' alt=''></img>


      <ul> 
        {blogs && console.log("yayy")}
        {blogs && blogs.map((blog) => <li><h3>{blog.title}</h3><p>{blog.content.slice(0,30)} ... <a href='#'>Read more</a> </p></li>)}
      </ul>
    </div>

  );
}

function WriteBlog(props){
  return (
    <div>
      <h1>Write Blog</h1>
      <form onSubmit={props.handleSubmit}>
        <table>
          <tbody>
          <tr>
            <td>Title</td>
            <td><input type="text" name="title" /></td>
          </tr>
          <tr>
            <td>Content</td>
            <td><textarea name="content" rows="10" cols="30"></textarea></td>
          </tr>
          </tbody>
        </table>
        <input type="submit"/>
      </form>
    </div>
  )
}

export default Page;