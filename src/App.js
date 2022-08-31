import { useState, useEffect } from 'react';
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';
import { SEARCH_ALL_REQUEST, LOGIN_USER } from './query/user';
import { v4 as uuidv4 } from 'uuid';
import Pagination from './Pagination';
import s from './App.module.css';

function App() {

  const [login] = useMutation(LOGIN_USER);

  // const { data, loading, error } = useQuery(SEARCH_ALL_REQUEST, {
  //   variables: {
  //     searchValue: "",
  //     skip: 0,
  //     first: 15, // set count of data of users to get
  //   },
  // });

  const [runQuery, { called, loading, data }] = useLazyQuery(SEARCH_ALL_REQUEST, {
    variables: {
      searchValue: "",
      skip: 0,
      first: 6,
    },
  });

  const handleClick = async () => {

    runQuery({
      variables: {
        searchValue: "",
        skip: 0,
        first: 6,
      }
    });

  }

  const handleLogin = async (e) => {
    login({
      variables: {
        login: "login",
        password: "password"
      }
    })
      .then((res) => {
        localStorage.setItem(
          'token',
          res.data.loginWidthLoginPass
        );
        console.log("localStorage: ", localStorage)
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  useEffect(() => {

    if ((typeof (data) == 'undefined')) {
    } else {
      console.log("Data: ", data);
    }

  }, [data]);

  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(2);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  if (loading) return <p className={s.loading}>Loading...</p>;

  return (
    <div className={s.App}>
      <div className={s.user}>

        <button onClick={handleLogin}>Click</button>
        <button onClick={() => { handleClick(data) }}>Click2</button>

        <div>
          <p className={s.title}>Users data</p>
        </div>

        {(typeof (data) == 'undefined') ? (
          <p>DATA is loading...</p>
        ) : (
          <div>
            <div className={s.wrapperUsersData}>
              <ul className={s.usersData}>
                {data.searchRequests.slice(indexOfFirstPost, indexOfLastPost).map(dat =>
                  <div key={uuidv4()} className={s.userData}>
                    <li><span>ID: </span>{dat.id}</li>
                    <li><span>Business name: </span>{dat.business_name}</li>
                    <li><span>Business phone: </span>{dat.business_phone}</li>
                    <li><span>Business email: </span>{dat.business_mail}</li>
                    <li><span>Description: </span>{dat.description ? dat.description : <span className={s.spanThick}>NONE</span>}</li>
                    <li><span>Link to map: </span>{dat.link_to_map ? dat.link_to_map : <span className={s.spanThick}>NONE</span>}</li>
                    <li><span>link to site: </span>{dat.link_to_site ? dat.link_to_site : <span className={s.spanThick}>NONE</span>}</li>


                    <li><span>Owners phone: </span>{dat.owners_phone ? dat.owners_phone : <span className={s.spanThick}>NONE</span>}</li>
                    <li><span>Owners name: </span>{dat.owners_name ? dat.owners_name : <span className={s.spanThick}>NONE</span>}</li>
                    <li><span>Photo: </span> {dat.photo ? <img src={dat.photo} alt={dat.business_name} width="120" height="100" /> : <span className={s.spanThick}>NONE</span>} </li>

                  </div>
                )}
              </ul>

            </div>
            <Pagination
              postsPerPage={postsPerPage}
              totalPosts={data.searchRequests.length}
              paginate={paginate}
            />
          </div>
        )}

      </div>
    </div >
  );
}

export default App;
