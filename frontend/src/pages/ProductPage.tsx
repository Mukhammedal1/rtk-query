import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import {
  useGetProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  Product,
} from "../services/productsApi";

const ProductsPage: React.FC = () => {
  const { data: products, isLoading, refetch } = useGetProductsQuery();
  const [addProduct] = useAddProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [form] = Form.useForm<Product>();

  const showModal = (product: Product | null = null) => {
    setEditingProduct(product);
    form.setFieldsValue(product || { name: "", price: 0 });
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    try {
      if (editingProduct && editingProduct._id !== undefined) {
        await updateProduct({
          _id: editingProduct._id,
          updatedProduct: values,
        }).unwrap();
        message.success("Product updated");
      } else {
        await addProduct(values).unwrap();
        message.success("Product added");
      }
      refetch();
      setIsModalOpen(false);
    } catch {
      message.error("Failed to save product");
    }
  };

  const handleDelete = async (_id: string) => {
    try {
      await deleteProduct(_id).unwrap();
      message.success("Product deleted");
      refetch();
    } catch {
      message.error("Failed to delete");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `$${price}`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Product) => (
        <>
          <Button type="link" onClick={() => showModal(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record._id!)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  if (isLoading) return <div>Loading...</div>;

  return (
    <div style={{ padding: 24 }}>
      <Button
        type="primary"
        onClick={() => showModal()}
        style={{ marginBottom: 16 }}
      >
        Add Product
      </Button>
      <Table
        pagination={false}
        dataSource={products}
        columns={columns}
        rowKey="_id"
      />

      <Modal
        title={editingProduct ? "Edit Product" : "Add Product"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Name required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Price required" }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductsPage;
