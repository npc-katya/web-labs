import { useState, useRef, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../app/store";
import { fetchEventsThunk } from "../features/events/eventSlice";

import { EventWithCreator } from "../features/events/eventSlice";
import { EventService } from "../api/eventService";
import { jwtDecode } from "jwt-decode";
import { UserService } from "../api/userService";
import { useClickOutside } from "../utils/useClickOutside";

interface FormData {
  title: string;
  date: Date;
  location: string;
  description: string;
}

export const useEventLogic = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { events, isLoading, isError, message } = useSelector(
    (state: RootState) => state.events,
  );
  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{
    id: number | null;
    name: string;
  }>({ id: null, name: "" });
  
  const [formData, setFormData] = useState({
    title: "",
    date: new Date(),
    description: "",
    location: "53.229292, 50.197327",
    coordinates: [53.229292, 50.197327] as [number, number],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActionsModalOpen, setIsActionsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventWithCreator | null>(
    null,
  );
  const [mapState, setMapState] = useState({
    center: [53.229292, 50.197327] as [number, number],
    zoom: 10,
  });
  
  const [selectedCoordinates, setSelectedCoordinates] = useState<
    [number, number] | null
  >(null);
  const [inputMethod, setInputMethod] = useState<"map" | "manual">("map");
  const [highlightedEvent, setHighlightedEvent] = useState<number | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const actionModalRef = useRef<HTMLDivElement>(null);
  const deleteConfirmRef = useRef<HTMLDivElement>(null);

  const [searchTerm] = useState("");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useClickOutside(modalRef, () => setIsModalOpen(false), isModalOpen);
  useClickOutside(
    actionModalRef,
    () => setIsActionsModalOpen(false),
    isActionsModalOpen,
  );
  useClickOutside(
    deleteConfirmRef,
    () => setIsDeleteConfirmOpen(false),
    isDeleteConfirmOpen,
  );
  
  const getTokenFromCookie = useCallback((): string | null => {
    const cookies = document.cookie.split("; ");
    const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));
    return tokenCookie ? tokenCookie.split("=")[1] : null;
  }, []);

  useEffect(() => {
    const loadUserAndEvents = async () => {
      const tokenFromCookie = getTokenFromCookie();
      setToken(tokenFromCookie);

      if (tokenFromCookie) {
        try {
          const decoded: any = jwtDecode(tokenFromCookie);
          const userService = new UserService(tokenFromCookie);
          const user = await userService.fetchUserById(decoded.id);

          setCurrentUser({ id: decoded.id, name: user.name });
        } catch (error) {
          console.error("Ошибка получения пользователя:", error);
        }
      }

      dispatch(fetchEventsThunk());
    };

    loadUserAndEvents();
  }, [dispatch, getTokenFromCookie]);

  const handleMapClick = useCallback(
    (e: any) => {
      if (inputMethod === "map") {
        const coords = e.get("coords") as [number, number];
        setSelectedCoordinates(coords);
        setFormData((prev) => ({
          ...prev,
          location: `${coords[0]}, ${coords[1]}`,
          coordinates: coords,
        }));
      }
    },
    [inputMethod],
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "location" && inputMethod === "manual") {
      const coords = value.split(",").map((coord) => parseFloat(coord.trim()));
      if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
        setSelectedCoordinates(coords as [number, number]);
      }
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      date: e.target.value ? new Date(e.target.value) : new Date(),
    }));
  };

  const toggleInputMethod = () => {
    const newMethod = inputMethod === "map" ? "manual" : "map";
    setInputMethod(newMethod);

    if (newMethod === "map" && selectedCoordinates) {
      setFormData((prev) => ({
        ...prev,
        location: `${selectedCoordinates[0]}, ${selectedCoordinates[1]}`,
      }));
    }
  };

  const openCreateModal = () => {
    setSelectedEvent(null);
    setFormData({
      title: "",
      date: new Date(),
      description: "",
      location: "53.229292, 50.197327",
      coordinates: [53.229292, 50.197327],
    });
    setSelectedCoordinates([53.229292, 50.197327]);
    setInputMethod("map");
    setIsModalOpen(true);

  };

  const openEditModal = (event: EventWithCreator) => {
    closeActionsModal();
    closeDeleteConfirm();
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      date: new Date(event.date),
      description: event.description,
      location: event.location,
      coordinates: [event.coordinates[0], event.coordinates[1]],
    });
    setSelectedCoordinates([event.coordinates[0], event.coordinates[1]]);
    setInputMethod("manual");
    setIsModalOpen(true);
  };

  const openActionsModal = (event: EventWithCreator) => {
    setSelectedEvent(event);
    setIsActionsModalOpen(true);

  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setSelectedCoordinates(null);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const closeActionsModal = () => {
    setIsActionsModalOpen(false);
    setSelectedEvent(null);
  };

  const openDeleteConfirm = () => {
    setIsDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);
  };

  const handleSubmit = async (data: FormData) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!token || !currentUser.id) {
      setErrorMessage("необходима авторизация для выполнения этого действия.");
      return;
    }

    if (
      inputMethod === "manual" &&
      !/^-?\d+\.\d+,\s*-?\d+\.\d+$/.test(data.location)
    ) {
      setErrorMessage(
        'некорректный формат координат. Используйте формат: "широта, долгота"',
      );
      return;
    }

    try {
      const eventService = new EventService(token);

      if (selectedEvent) {
        await eventService.updateEvent(selectedEvent.id, { ...data });
        setSuccessMessage("событие успешно обновлено.");
      } else {
        await eventService.createEvent({
          ...data,
          createdBy: currentUser.id,
        });
        setSuccessMessage("событие успешно создано.");
      }

      dispatch(fetchEventsThunk());
      closeModal();
    } catch (error: any) {
      console.error("ошибка при сохранении события:", error);
      const status = error?.response?.status || "";
      const serverMessage =
        error?.response?.data?.message || "не удалось сохранить событие.";
      setErrorMessage(`Ошибка ${status}: ${serverMessage}`);
    }
  };

  const handleDelete = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!token || !selectedEvent) return;

    try {
      const eventService = new EventService(token);
      await eventService.deleteEvent(selectedEvent.id);
      setSuccessMessage("событие успешно удалено.");
      dispatch(fetchEventsThunk());
      closeDeleteConfirm();
      closeActionsModal();
    } catch (error: any) {
      console.error("ошибка при удалении события:", error);
      const status = error?.response?.status || "";
      const serverMessage =
        error?.response?.data?.message || "не удалось удалить событие.";
      setErrorMessage(`ошибка ${status}: ${serverMessage}`);
    }
  };

  const showEventOnMap = useCallback(
    (eventId: number, coordinates: number[]) => {
      setHighlightedEvent(eventId);
      setMapState({
        center: coordinates as [number, number],
        zoom: 14,
      });
      closeActionsModal();
    },
    [],
  );

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.creatorName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return {
    modalRef,
    actionModalRef,
    deleteConfirmRef,
    formData,
    inputMethod,
    selectedCoordinates,
    closeModal,
    currentUser,
    selectedEvent,
    closeDeleteConfirm,
    closeActionsModal,

    message,
    isLoading,
    isError,
    isModalOpen,
    isActionsModalOpen,
    isDeleteConfirmOpen,
    mapState,
    highlightedEvent,
    handleMapClick,
    filteredEvents,
    handleSubmit,
    handleDelete,
    openActionsModal,
    openDeleteConfirm,
    openEditModal,
    openCreateModal,
    handleInputChange,
    handleDateChange,
    toggleInputMethod,
    showEventOnMap,
    errorMessage,
    successMessage,
  };
};
