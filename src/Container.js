import React, { useState, useEffect } from "react";
import axios from "axios";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import { getDefaultNormalizer } from "@testing-library/react";

const MainContainer = () => {
  const API = "http://localhost:3001";
  const [jobTitle, setJobTitle] = useState("");
  const [salary, setSalary] = useState(0);
  const [allJobs, setAllJobs] = useState([]);
  const [retrievedJob, setRetrievedJob] = useState({});
  const [searchUrl, setSearchUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${API}/read`).then((res) => {
      setAllJobs(res.data);
    });
  });

  const handleForm = () => {
    axios.post(`${API}/insert`, {
      jobTitle: jobTitle,
      salary: salary,
    });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/delete/${id}`);
    console.log(id);
  };

  const handleUrl = (text) => {
    setSearchUrl(text);
  };

  const handleSearch = () => {
    setLoading(true);
    axios
      .post(`${API}/jobsearch`, {
        searchUrl: searchUrl,
      })
      .then((res) => setData(res.data))
      .then(() => {
        // axios.post(`${API}/insert`, {
        //   jobTitle: retrievedJob.title,
        //   salary: retrievedJob.salary,
        // });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const refreshData = () => {
    axios.get(`${API}/jobsearch`).then((res) => {
      setRetrievedJob(res.data);
    });
  };

  const setData = (data) => {
    setRetrievedJob(data);
    axios.post(`${API}/insert`, {
      title: data.title,
      company: data.company,
      salary: data.salary,
      location: data.location,
    });
    setLoading(false);
  };

  return (
    <Container maxWidth="lg">
      <h1>Crud App</h1>
      <label>Job title</label>
      <input type="text" onChange={(e) => setJobTitle(e.target.value)} />
      <label>Salary</label>
      <input type="number" onChange={(e) => setSalary(e.target.value)} />
      <button onClick={() => handleForm()}>Add Job</button>

      <h2>All Jobs</h2>
      <table>
        {allJobs.map((job) => {
          return (
            <>
              <tr>
                <td>{job.title}</td>
                <td>{job.company}</td>
                <td>{job.salary}</td>
                <td>{job.location}</td>
                <td>
                  <button onClick={() => handleDelete(job._id)}>Delete</button>
                </td>
              </tr>
            </>
          );
        })}
      </table>

      {/* <button onClick={() => refreshData()}>Refresh</button> */}

      <label>Insert Job Url</label>
      <input type="text" onChange={(e) => handleUrl(e.target.value)} />
      <button onClick={() => handleSearch()}>Search</button>
      <br />
      {loading ? "Your job is loading..." : ""}

      {/* {retrievedJob.title}
      <br />
      {retrievedJob.location}
      <br />
      {retrievedJob.company}
      <br />
      {retrievedJob.salary} */}
    </Container>
  );
};

export default MainContainer;
