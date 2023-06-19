import React, { useEffect, useState } from "react";
import "./UsersList.css";
import ReactPaginate from "react-paginate";
import { config } from "./PageCount"
import { AiFillDelete, AiFillEdit, AiFillSave } from "react-icons/ai";
import { ProcessingUsers } from "./ProcessingUsers";
// import {useRef} from "react";
import {Pagination} from '@mui/material';

const UsersList = () => {
  const [searchUser, setSearchUser] = useState("");
  const [users, setUsers] = useState([]);

  // pagination state templates...
  const [pageCount, setPageCount] = useState(0);
  const itemPerPage = config.PAGE_COUNT;
  let pageVisited = pageCount * itemPerPage;
  const noOfPages = Math.ceil(users.length / itemPerPage);
  const [deleteList, setDeleteList] = useState(false);

  // handling page click to render selected page...
  const handlePageClick = ({ selected }) => {
    setPageCount(selected);
  };

  // default fetch effect from API...
  useEffect(() => {
    getUsersDetails();
  }, []);

  const getUsersDetails = () => {
    fetch(
      `https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json`
    )
      .then((res) => res.json())
      .then((data) => {
        setUsers(ProcessingUsers(data));
        console.log(data);
      })
      // error handling
      .catch((err) => {
        console.log("Error:", err);
      });
  };

  // handling select single user for delete...
  const handleChange = index => {

    setUsers(users.map(user =>
      user.id === index ? { ...user, selected: !user.selected } : user));
    console.log(users[0]);

  };

  // Delete data of single User onClick...
  const deleteUser = (selectedUser) => {
    let userAfterDeletion = users.filter((user) => {
      return user.id !== selectedUser;
    });
    setUsers(userAfterDeletion);
  };

  // handling select users of the entire page...
  const handleSelectAll = (e) => {
    let tempUser = users
      .slice(pageVisited, pageVisited + itemPerPage)
      .map((user) => user.id);

    let tempUsers = users.map((user) => {
      if (tempUser.includes(user.id)) {
        user.selected = e.target.checked;
        return user;
      }
      return user;
    });

    setUsers(tempUsers);
    e.target.checked ? setDeleteList(true) : setDeleteList(false);
  };

   // Delete entire Users on current page on clicking DeleteAll button...
  const deleteUsers = () => {
    let userAfterDeletion = users.filter((user) => {
      return !user.selected;
    });
    setUsers(userAfterDeletion);
    setDeleteList(false);
  };


  // editing temporarily the user data on UI ...
  const editUserDetails = (index) => {
    setUsers(users.map(user =>
      user.id === index ? { ...user, edit: !user.edit } : user
    ));
  };

  // Saving the edited items temporarily in the DOM...
  const saveUserDetails = (index, nameRef, emailRef, roleRef) => {
    setUsers(users.map(user =>
      user.id === index ? { ...user, edit: !user.edit } : user
    ));
  };
  

  // UI rendering component...
  return (
    <div className="container">
      <div className="height">
        <br />

        {/* Search UI Component */}
        <div className="searchbar">
          <input className="searchbox"
            type="text"
            name="name"
            placeholder=" Search by any field.... "
            onChange={(e) => { setSearchUser(e.target.value) }}
          /></div>

        <div>
          <table className="table">

            {/* header SelectAll UI component  */}
            <thead className="thead">
              <tr>
                <th className="icon">
                  <input className="selectAll"
                    type="checkbox" id="selectAll"
                    label="selectAll"
                    onChange={(e) => handleSelectAll(e)}></input>
                </th>

                <th className="c1">Name</th>
                <th className="c2">Email </th>
                <th className="c3"> role</th>
                <th className="c4">Action</th>
              </tr>
            </thead>


            {/* //implementing user detais on row-wise */}
            <tbody>

              {users
                .filter((user) => {
                  if (searchUser === "") return user;
                  else if (
                    user.name.includes(searchUser) ||
                    user.email.includes(searchUser) ||
                    user.role.includes(searchUser)
                  ) {
                    return user;
                  }
                })
                .slice(pageVisited, pageVisited + itemPerPage)
                .map((user) => (

                  <>

                    <tr className={user.selected ? "onSelectChange" : " "} key={user.id}>

                      <td className="icon"><input className="selectAll"
                        type="checkbox" id={user.id}
                        checked={user.selected}
                        onChange={() => handleChange(user.id)} />
                      </td>

                      <td> <input
                        className={user.edit ? "editable" : "readOnly"}
                        readOnly={!user.edit}
                        type="text"
                        name="name"
                        defaultValue={user.name}
                      /></td>

                      <td>
                        <input
                          className={user.edit ? "editable" : "readOnly"}
                          readOnly={!user.edit}
                          type="email"
                          name="email"
                          defaultValue={user.email}
                        />
                      </td>

                      <td className="c3"> <input
                        className={user.edit ? "editable" : "readOnly"}
                        readOnly={!user.edit}
                        type="text"
                        name="role"
                        defaultValue={user.role}
                      /></td>

                      <td><td className="btn">
                        {user.edit ? <button className="tooltip" onClick={() => saveUserDetails(user.id)}>
                          <AiFillSave /><span class="tooltiptext">Save</span>
                        </button> : (
                          <button className="tooltip" onClick={() => editUserDetails(user.id)}>
                            <AiFillEdit /><span class="tooltiptext">Edit</span>
                          </button>)}

                        <button className="tooltip" onClick={() => deleteUser(user.id)}>
                          {" "}
                          <AiFillDelete />{" "} <span class="tooltiptext">Delete</span>
                        </button>
                      </td></td>

                    </tr>

                  </>
                ))}

            </tbody>
          </table>
        </div>

        <div>
          {deleteList && <button onClick={() => deleteUsers()}>DeleteAll</button>}
        </div>
        <br />

        {/* pagination */}
      </div>
      <footer>
        <hr />
        <ReactPaginate
          containerClassName={<Pagination variant="outlined" color="primary"/>}
          previousLabel={"<"}
          nextLabel={">"}
          pageCount={noOfPages}
          onPageChange={handlePageClick}
          renderOnZeroPageCount={null}
          pageLinkClassName="page-num"
          previousLinkClassName="page-num"
          nextLinkClassName="page-num"
          activeLinkClassName="active"
          pageRangeDisplayed={10}
        />
      </footer>

    </div>
  );
}

export default UsersList;