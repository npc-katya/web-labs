import React, { useState, useRef, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { EventService, Event } from "./eventService";
import { UserService } from "./userService";

import { useClickOutside } from "../utils/useClickOutside";

interface EventWithCreator extends Event {
  creatorName: string;
  coordinates: number[];
}

export const useEventLogic = () => {
  // состояния для данных формы
  const [formData, setFormData] = useState({
    title: "",
    date: new Date(),
    description: "",
    location: "53.229292, 50.197327",
    coordinates: [53.229292, 50.197327],
  });

  // состояния для авторизации и пользователя
  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{
    id: number | null;
    name: string;
  }>({ id: null, name: "" });

  // состояния для данных
  const [events, setEvents] = useState<EventWithCreator[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm] = useState("");

  // состояния для модальных окон
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventWithCreator | null>(
    null,
  );
  const [isActionsModalOpen, setIsActionsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // состояния для карты
  const [mapState, setMapState] = useState({
    center: [53.229292, 50.197327] as [number, number],
    zoom: 10,
  });
  const [selectedCoordinates, setSelectedCoordinates] = useState<
    [number, number] | null
  >(null);
  const [inputMethod, setInputMethod] = useState<"map" | "manual">("map");
  const [highlightedEvent, setHighlightedEvent] = useState<number | null>(null);

  // получение токена из cookie
  const getTokenFromCookie = useCallback((): string | null => {
    const cookies = document.cookie.split("; ");
    const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));
    return tokenCookie ? tokenCookie.split("=")[1] : null;
  }, []);

  // преобразование строки локации в координаты
  const parseLocation = useCallback((location: string): number[] => {
    return location.split(",").map((coord) => parseFloat(coord.trim()));
  }, []);

  // обработчик клика по карте
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

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.creatorName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // загрузка начальных данных
  useEffect(() => {
    const loadInitialData = async () => {
      const tokenFromCookie = getTokenFromCookie();
      setToken(tokenFromCookie);

      try {
        await fetchEvents(tokenFromCookie);

        if (tokenFromCookie) {
          const decoded: any = jwtDecode(tokenFromCookie);
          const userService = new UserService(tokenFromCookie);
          const user = await userService.fetchUserById(decoded.id);

          setCurrentUser({
            id: decoded.id,
            name: user.name,
          });
        }
      } catch (error) {
        console.error("ошибка загрузки данных:", error);
        setMessage("ошибка при загрузке данных");
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [getTokenFromCookie]);

  // загрузка событий с именами создателей
  const fetchEvents = useCallback(
    async (token: string | null) => {
      try {
        setIsLoading(true);
        const eventService = new EventService(token);

        const fetchedEvents = await eventService.fetchEvents();

        const eventsWithCreators = await Promise.all(
          fetchedEvents.map(async (event) => {
            const coordinates = parseLocation(event.location);
            let creatorName = "кто-то";

            if (token && event.createdBy === currentUser.id) {
              creatorName = currentUser.name;
            } else if (token) {
              const userService = new UserService(token);
              const creator = await userService.fetchUserById(event.createdBy);
              creatorName = creator.name;
            }

            return {
              ...event,
              creatorName,
              coordinates,
            };
          }),
        );

        setEvents(eventsWithCreators);

        if (fetchedEvents.length > 0) {
          const firstEventCoords = parseLocation(fetchedEvents[0].location);
          setMapState({
            center: firstEventCoords as [number, number],
            zoom: 10,
          });
        }
      } catch (error) {
        console.error("Ошибка загрузки событий:", error);
        setMessage("Ошибка при загрузке событий");
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    },
    [currentUser.id, currentUser.name, parseLocation],
  );

  // обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !currentUser.id) {
      setMessage("необходима авторизация");
      return;
    }

    if (
      inputMethod === "manual" &&
      !/^-?\d+\.\d+,\s*-?\d+\.\d+$/.test(formData.location)
    ) {
      setMessage('некорректный формат локации. используйте: "широта, долгота"');
      return;
    }

    try {
      const eventService = new EventService(token);

      if (selectedEvent) {
        await eventService.updateEvent(selectedEvent.id, {
          ...formData,
          location: formData.location,
        });
        setMessage("событие успешно обновлено");
      } else {
        await eventService.createEvent({
          ...formData,
          createdBy: currentUser.id,
          location: formData.location,
        });
        setMessage("событие успешно создано");
      }

      await fetchEvents(token);
      closeModal();
    } catch (error) {
      console.error("ошибка:", error);
      setMessage(
        `ошибка при ${selectedEvent ? "обновлении" : "создании"} события`,
      );
    }
  };

  // удаление события
  const handleDelete = async () => {
    if (!token || !selectedEvent) return;

    try {
      const eventService = new EventService(token);
      await eventService.deleteEvent(selectedEvent.id);
      setMessage("событие успешно удалено");
      await fetchEvents(token);
      closeDeleteConfirm();
      closeActionsModal();
    } catch (error) {
      console.error("ошибка:", error);
      setMessage("ошибка при удалении события");
    }
  };

  // модальные окна
  const openActionsModal = (event: EventWithCreator) => {
    setSelectedEvent(event);
    setIsActionsModalOpen(true);
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

  const openEditModal = (event: EventWithCreator) => {
    closeActionsModal();
    closeDeleteConfirm();

    setSelectedEvent(event);
    setFormData({
      title: event.title,
      date: event.date,
      description: event.description,
      location: event.location,
      coordinates: event.coordinates,
    });
    setSelectedCoordinates(event.coordinates as [number, number]);
    setInputMethod("manual");

    setIsModalOpen(true);
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

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setSelectedCoordinates(null);
  };

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

  // переключение метода ввода координат
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

  const modalRef = useRef<HTMLDivElement>(null);
  const actionModalRef = useRef<HTMLDivElement>(null);
  const deleteConfirmRef = useRef<HTMLDivElement>(null);

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

  return {
    modalRef,
    actionModalRef,
    deleteConfirmRef,

    setFormData,
    setSelectedCoordinates,
    setInputMethod,

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
  };
};
