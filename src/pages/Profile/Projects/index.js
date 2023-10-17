import { Button, message, Table, DatePicker } from "antd";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DeleteProject, GetAllProjects } from "../../../apicalls/projects";
import { SetLoading } from "../../../redux/loadersSlice";
import { getDateFormat, getTimelineFormat } from "../../../utils/helpers";
import ProjectForm from "./ProjectForm";
import { Link } from "react-router-dom";
import moment from "moment";

function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [show, setShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10; // Number of items per page
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const [timeline, setTimeline] = useState(null); // State for timeline

  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetAllProjects({
        owner: user._id,
        page: currentPage,
        limit: pageSize,
      });
      if (response.success) {
        setProjects(response.data);
        setTotalItems(response.totalProjects);
      } else {
        throw new Error(response.error);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      message.error(error.message);
      dispatch(SetLoading(false));
    }
  };

  const onDelete = async (id) => {
    try {
      dispatch(SetLoading(true));
      const response = await DeleteProject(id);
      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        throw new Error(response.error);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      message.error(error.message);
      dispatch(SetLoading(false));
    }
  };

  useEffect(() => {
    getData();
  }, [currentPage]); // Trigger getData on page change

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <Link
          to={`/project/${record._id}`}
          style={{ color: "black", textDecoration: "underline" }}
        >
          {text}
        </Link>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => text.toUpperCase(),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (text) => getDateFormat(text),
    },
    {
      title: "Timeline",
      dataIndex: "timeline",
      render: (text) => getTimelineFormat(text),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <div className="flex gap-4">
            <i
              className="ri-delete-bin-line"
              onClick={() => onDelete(record._id)}
            ></i>
            <i
              className="ri-pencil-line"
              onClick={() => {
                setSelectedProject(record);
                setTimeline(record.timeline); // Set timeline
                setShow(true);
              }}
            ></i>
          </div>
        );
      },
    },
  ];

  const pagination = {
    current: currentPage,
    pageSize: pageSize,
    total: totalItems,
    onChange: handlePageChange,
  };

  return (
    <div>
      <div className="flex justify-end">
        <Button
          type="default"
          onClick={() => {
            setSelectedProject(null);
            setTimeline(null); // Reset timeline
            setShow(true);
          }}
        >
          Add Project
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={projects}
        className="mt-4"
        pagination={pagination}
      />
      {show && (
        <ProjectForm
          show={show}
          setShow={setShow}
          reloadData={getData}
          project={selectedProject}
          timeline={timeline} // Pass timeline to ProjectForm
        />
      )}
    </div>
  );
}

export default Projects;
