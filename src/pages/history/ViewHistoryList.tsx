import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/hooks/useReduxHook";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef } from "@ag-grid-community/core";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTeplate";
import { Icons } from "@/components/icons/icons";
import { useEffect } from "react";
import { getHistoryList, deleteHistory } from "@/features/history/historySlice";
import { IconButton, Tooltip } from "@mui/material";
import SharedDialog from "@/components/shared/SharedDialog";
import { useState } from "react";

const ViewHistoryList = () => {
  const dispatch = useAppDispatch();
  const { historyList, historyListLoading, deleteHistoryLoading } = useAppSelector(
    (state) => state.history
  );

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const columns: ColDef[] = [
    {
      field: "date",
      headerName: "Date",
      minWidth: 150,
      maxWidth: 200,
      filter: true,
      cellRenderer: (params: any) => {
        if (!params.value) return "-";
        const date = new Date(params.value);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      },
      flex: 1,
    },
    {
      field: "title",
      headerName: "Title",
      minWidth: 200,
      maxWidth: 400,
      filter: true,
      flex: 1,
      cellRenderer: (params: any) => (
        <div className="py-[5px]">
          <span className="text-slate-700 font-medium">{params.value || "-"}</span>
        </div>
      ),
      autoHeight: true,
    },
    {
      field: "description",
      headerName: "Description",
      minWidth: 300,
      maxWidth: 500,
      filter: true,
      flex: 1,
      cellRenderer: (params: any) => {
        const description = params.value || "";
        const truncated = description.length > 100 
          ? description.substring(0, 100) + "..." 
          : description;
        return (
          <div className="py-[5px]">
            <Tooltip title={description || ""}>
              <span className="text-slate-600">{truncated || "-"}</span>
            </Tooltip>
          </div>
        );
      },
      autoHeight: true,
    },
    {
      field: "created_by_name",
      headerName: "Created By",
      minWidth: 150,
      maxWidth: 250,
      filter: true,
      flex: 1,
      cellRenderer: (params: any) => (
        <div className="py-[5px]">
          <span className="text-slate-700">{params.value || params.data?.created_by || "-"}</span>
        </div>
      ),
    },
    {
      field: "video_url",
      headerName: "Video URL",
      minWidth: 100,
      maxWidth: 150,
      flex: 1,
      cellRenderer: (params: any) => {
        if (!params.value) return <span className="text-gray-400">-</span>;
        return (
          <Tooltip title={params.value}>
            <a
              href={params.value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-1"
            >
              <Icons.followLink fontSize="small" />
              View
            </a>
          </Tooltip>
        );
      },
    },
    {
      field: "doc_url",
      headerName: "Document URL",
      minWidth: 100,
      maxWidth: 150,
      flex: 1,
      cellRenderer: (params: any) => {
        if (!params.value) return <span className="text-gray-400">-</span>;
        return (
          <Tooltip title={params.value}>
            <a
              href={params.value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-1"
            >
              <Icons.followLink fontSize="small" />
              View
            </a>
          </Tooltip>
        );
      },
    },
    {
      field: "created_date",
      headerName: "Created Date",
      minWidth: 180,
      maxWidth: 250,
      filter: true,
      flex: 1,
      cellRenderer: (params: any) => {
        if (!params.value) return "-";
        const date = new Date(params.value);
        return date.toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      },
    },
    {
      headerName: "Actions",
      minWidth: 120,
      maxWidth: 150,
      pinned: "right",
      cellRenderer: (params: any) => {
        return (
          <div className="flex items-center gap-2">
            <Tooltip title="Delete">
              <IconButton
                size="small"
                color="error"
                onClick={() => {
                  setPendingDelete(params.data.id);
                  setConfirmOpen(true);
                }}
                disabled={deleteHistoryLoading}
              >
                <Icons.delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const handleConfirmDelete = () => {
    if (!pendingDelete) return;
    dispatch(deleteHistory(pendingDelete)).then((res: any) => {
      if (res.payload?.data?.success) {
        dispatch(getHistoryList());
      }
      setConfirmOpen(false);
      setPendingDelete(null);
    });
  };

  useEffect(() => {
    dispatch(getHistoryList());
  }, [dispatch]);

  return (
    <div className="h-full">
      <div className="h-[50px] flex items-center gap-[20px] px-[10px] text-blue-600 border-b justify-between ">
        <div className="flex items-center gap-[20px]">
          <Link to={"/history"} className="flex items-center gap-[5px]">
            <Icons.add fontSize="small" />
            Add New Changelog
          </Link>
        </div>
      </div>
      <div className={"ag-theme-quartz h-[calc(100vh-130px)] "}>
        <AgGridReact
          rowHeight={60}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          loadingOverlayComponent={CustomLoadingOverlay}
          suppressCellFocus={true}
          loading={historyListLoading}
          rowData={historyList ? historyList : []}
          columnDefs={columns}
          pagination
          paginationPageSize={20}
        />
      </div>

      <SharedDialog
        open={confirmOpen}
        title="Confirm Delete"
        content={
          <div>
            Are you sure you want to delete this changelog entry? This action cannot be undone.
          </div>
        }
        loading={deleteHistoryLoading}
        onClose={() => {
          setConfirmOpen(false);
          setPendingDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        confirmText="Yes, delete"
        cancelText="Cancel"
        color="error"
      />
    </div>
  );
};

export default ViewHistoryList;

