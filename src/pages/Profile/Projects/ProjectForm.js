import { Form, Input, message, Modal, DatePicker } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import { SetLoading } from "../../../redux/loadersSlice";
import { CreateProject, EditProject } from "../../../apicalls/projects";
import moment from "moment";
import { getTimelineFormat } from "../../../utils/helpers";

function ProjectForm({ show, setShow, reloadData, project }) {
  const formRef = React.useRef(null);
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const [timeline, setTimeline] = useState(null);

  useEffect(() => {
    // Set the timeline when the component mounts if a project is being edited
    if (project && project.timeline) {
      setTimeline(moment(project.timeline));
    }
  }, [project]);

  const handleTimelineChange = (date) => {
    setTimeline(date);
  };

  const onFinish = async (values) => {
    try {
      dispatch(SetLoading(true));

      // Convert timeline to ISO string format
      if (values.timeline) {
        values.timeline = values.timeline.toISOString();
      }

      let response = null;
      if (project) {
        // Edit project
        values._id = project._id;
        response = await EditProject(values);
      } else {
        // Create project
        values.owner = user._id;
        values.members = [
          {
            user: user._id,
            role: "owner",
          },
        ];
        response = await CreateProject(values);
      }

      if (response.success) {
        message.success(response.message);
        reloadData();
        setShow(false);
      } else {
        throw new Error(response.error);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      message.error(error.message);
      dispatch(SetLoading(false));
    }
  };
  console.log("Timeline:", timeline);

  return (
    <Modal
      title={project ? "EDIT PROJECT" : "CREATE PROJECT"}
      visible={show}
      onCancel={() => setShow(false)}
      centered
      width={700}
      onOk={() => {
        formRef.current.submit();
      }}
      okText="Save"
    >
      <Form
        layout="vertical"
        ref={formRef}
        onFinish={onFinish}
        initialValues={project}
      >
        <Form.Item label="Project Name" name="name">
          <Input placeholder="Project Name" />
        </Form.Item>
        <Form.Item label="Project Description" name="description">
          <TextArea placeholder="Project Description" />
        </Form.Item>
        <Form.Item label="Timeline" name="timeline">
          <DatePicker
            placeholder="Select Timeline"
            showTime={{ defaultValue: moment("00:00:00", "HH:mm:ss") }}
            onChange={handleTimelineChange}
            value={timeline}
            // Assuming timeline is the state for the selected timeline
          />
          {timeline && (
            <div style={{ marginTop: 10 }}>
              Selected Timeline: {getTimelineFormat(timeline)}
            </div>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ProjectForm;
