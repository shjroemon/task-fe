import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetProjectsByRole } from "../../apicalls/projects";
import { SetLoading } from "../../redux/loadersSlice";
import { message, Pagination } from "antd";
import { getDateFormat } from "../../utils/helpers";
import Divider from "../../components/Divider";
import { useNavigate } from "react-router-dom";

function Home() {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProjects, setTotalProjects] = useState(0);
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const pageSize = 10; // Number of projects per page

  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetProjectsByRole(currentPage, pageSize);
      dispatch(SetLoading(false));
      if (response.success) {
        setProjects(response.data);
        setTotalProjects(response.totalProjects);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    getData();
  }, [currentPage]);

  return (
    <div>
      <h1 className="text-primary text-xl">
        Heyy {user?.firstName} {user?.lastName} , Task-Management
      </h1>

      <div className="grid grid-cols-4 gap-5 mt-5">
        {projects.map((project) => (
          <div
            key={project._id}
            className="flex flex-col gap-1 border border-solid border-gray-400 rounded-md p-2 cursor-pointer"
            onClick={() => navigate(`/project/${project._id}`)}
          >
            <h1 className="text-primary text-lg uppercase font-semibold">
              {project.name}
            </h1>

            <Divider />

            <div className="flex justify-between">
              <span className="text-gray-600 text-sm font-semibold">
                Created At
              </span>
              <span className="text-gray-600 text-sm">
                {getDateFormat(project.createdAt)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm font-semibold">Owner</span>
              <span className="text-gray-600 text-sm">
                {project.owner.firstName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm font-semibold">
                Status
              </span>
              <span className="text-gray-600 text-sm uppercase">
                {project.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {totalProjects > pageSize && (
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalProjects}
          onChange={handlePageChange}
          className="mt-5"
        />
      )}

      {projects.length === 0 && (
        <div className="flex">
          <h1 className="text-primary text-xl">You have no projects yet</h1>
        </div>
      )}
    </div>
  );
}

export default Home;
