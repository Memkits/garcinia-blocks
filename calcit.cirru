
{}
  :about "|Machine-generated snapshot. Do not edit directly — changes will be overwritten. Use `calcit query` to inspect and `calcit edit`/`calcit tree` to modify. Run `calcit docs agents --contract` before mutations; use `--full` for first orientation or changed contract digest. Manual edits must follow format and schema conventions, then run `calcit edit format`."
  :package |app
  :entries $ {} $ :default
    {} (:description |) (:init-fn 'app.main/main!) (:mode :js) (:reload-fn 'app.main/reload!) (:target :browser)
      :feature-policy $ {}
      :modules $ [] |respo.calcit/ |respo-ui.calcit/ |reel.calcit/ |js-ffi/
      :type-slots $ {} $ :dispatch-op |app.schema/DispatchOp
  :files $ {}
    'app.comp.container $ %{} 'FileEntry
      :defs $ {} $ 'comp-container
        %{} 'CodeEntry (:doc |)
          :code $ quote $ defcomp comp-container (reel)
            let
                store $ decode-map-as
                  .unwrap $ get reel :store
                  Map Tag Dynamic
                states $ decode-map-as
                  .unwrap $ get store :states
                  Map Dynamic Dynamic
              div
                {} $ :style $ .merge ui/global ui/row
                <> |TODO
                if dev?
                  Option :some $ comp-reel (>> states :reel) reel $ {}
                  Option :none
          :examples $ []
          :schema $ quote $ Fn (Map Tag Dynamic) (-> respo.schema/Component) (:features :js-ffi)
      :ns $ %{} 'NsEntry (:doc |)
        :code $ quote $ ns app.comp.container
          :require (respo-ui.core :as ui)
            respo.core :refer $ defcomp <> >> div
            reel.comp.reel :refer $ comp-reel
            app.config :refer $ dev?
    'app.config $ %{} 'FileEntry
      :defs $ {}
        'dev? $ %{} 'CodeEntry (:doc |)
          :code $ quote $ def dev?
            = |dev $ .unwrap-or (get-env |mode) |release
          :examples $ []
          :schema $ quote Bool
        'site $ %{} 'CodeEntry (:doc |)
          :code $ quote $ def site
            {} $ :storage-key |workflow
          :examples $ []
          :schema $ quote $ Map Tag String
      :ns $ %{} 'NsEntry (:doc |)
        :code $ quote $ ns app.config
    'app.main $ %{} 'FileEntry
      :defs $ {}
        '*reel $ %{} 'CodeEntry (:doc |)
          :code $ quote $ defref *reel
            -> reel-schema/reel (assoc :base schema/store) (assoc :store schema/store)
          :examples $ []
          :schema $ quote $ Ref (Map Tag Dynamic)
        'dispatch! $ %{} 'CodeEntry (:doc |)
          :code $ quote $ defn dispatch! (op)
            when config/dev? $ println |Dispatch: op
            reset! *reel $ reel-updater update-wire-store @*reel op
            , &unit
          :examples $ []
          :schema $ quote $ Fn AnyEnum (-> Unit)
        'dispatch-wire! $ %{} 'CodeEntry (:doc |)
          :code $ quote $ defn dispatch-wire! (op)
            if (enum? op) (dispatch! op) (raise |Expected-Enum-operation)
          :examples $ []
          :schema $ quote $ Fn Dynamic (-> Unit)
        'main! $ %{} 'CodeEntry (:doc |)
          :code $ quote $ defn main! ()
            println "|Running mode:" $ if config/dev? |dev |release
            if config/dev? $ load-console-formatter!
            render-app!
            add-watch! *reel :changes $ fn (_reel _prev)
              hint-fn $ Fn (Map Tag Dynamic) (Map Tag Dynamic) (-> Unit)
              render-app!
            listen-devtools! |k dispatch-wire!
            match
              storage-get $ .unwrap-or (get config/site :storage-key) |workflow
              (:some raw)
                dispatch! $ :: :hydrate-storage $ parse-cirru-edn raw
              (:none) &unit
            add-event-listener! |beforeunload $ fn (_event)
              hint-fn $ Fn js-ffi.browser/EventHost $ -> Unit
              persist-storage!
            set-interval! persist-storage! 60000
            println "|App started."
            , &unit
          :examples $ []
          :schema $ quote $ Fn (-> Unit) (:features :js-ffi)
        'mount-target $ %{} 'CodeEntry (:doc |)
          :code $ quote $ defn mount-target ()
            .unwrap $ query-selector |.app
          :examples $ []
          :schema $ quote $ Fn (-> respo.dom/DomElement) (:features :js-ffi)
        'persist-storage! $ %{} 'CodeEntry (:doc |)
          :code $ quote $ defn persist-storage! () (js/console.log |persist)
            storage-set!
              .unwrap-or (get config/site :storage-key) |workflow
              format-cirru-edn $ .unwrap $ get @*reel :store
            , &unit
          :examples $ []
          :schema $ quote $ Fn (-> Unit) (:features :js-ffi)
        'reload! $ %{} 'CodeEntry (:doc |)
          :code $ quote $ defn reload! ()
            if (nil? build-errors)
              do (remove-watch! *reel :changes) (clear-cache!)
                add-watch! *reel :changes $ fn (reel prev)
                  hint-fn $ Fn (Map Tag Dynamic) (Map Tag Dynamic) (-> Unit)
                  render-app!
                reset! *reel $ decode-map-as (refresh-reel @*reel schema/store update-wire-store) (Map Tag Dynamic)
                hud! |ok~ |Ok
              hud! |error build-errors
            , &unit
          :examples $ []
          :schema $ quote $ Fn (-> Unit)
        'render-app! $ %{} 'CodeEntry (:doc |)
          :code $ quote $ defn render-app! ()
            render! (mount-target) (comp-container @*reel) dispatch!
            , &unit
          :examples $ []
          :schema $ quote $ Fn (-> Unit)
      :ns $ %{} 'NsEntry (:doc |)
        :code $ quote $ ns app.main
          :require
            respo.core :refer $ render! clear-cache!
            app.comp.container :refer $ comp-container
            app.updater :refer $ update-wire-store
            app.schema :as schema
            reel.util :refer $ listen-devtools!
            reel.core :refer $ reel-updater refresh-reel
            reel.schema :as reel-schema
            app.config :as config
            |./calcit.build-errors.mjs :default build-errors
            |bottom-tip :default hud!
            respo.ffi.browser :refer $ query-selector
            js-ffi.browser :refer $ storage-get storage-set! add-event-listener! set-interval!
    'app.schema $ %{} 'FileEntry
      :defs $ {}
        'DispatchOp $ %{} 'CodeEntry (:doc |)
          :code $ quote $ def DispatchOp
            :: :states ([]) nil
          :examples $ []
          :schema $ quote AnyEnum
        'store $ %{} 'CodeEntry (:doc |)
          :code $ quote $ def store
            {} $ :states $ {}
              :cursor $ []
          :examples $ []
          :schema $ quote $ Map Tag Dynamic
      :ns $ %{} 'NsEntry (:doc |)
        :code $ quote $ ns app.schema
    'app.updater $ %{} 'FileEntry
      :defs $ {}
        'update-wire-store $ %{} 'CodeEntry (:doc |)
          :code $ quote $ defn update-wire-store (store op op-id op-time)
            if (enum? op)
              updater
                decode-map-as store $ Map Tag Dynamic
                , op (decode-map-as op-id 'String) (decode-map-as op-time 'Number)
              raise |Expected-Enum-operation
          :examples $ []
          :schema $ quote $ Fn Dynamic Dynamic Dynamic Dynamic
            -> $ Map Tag Dynamic
        'updater $ %{} 'CodeEntry (:doc |)
          :code $ quote $ defn updater (store op op-id op-time)
            match op
              (:states cursor data)
                decode-map-as
                  update-states store
                    decode-map-as cursor $ List respo.schema/CoordKey
                    , data
                  Map Tag Dynamic
              (:hydrate-storage data)
                decode-map-as data $ Map Tag Dynamic
              _ $ do (println "|unknown op:" op) store
          :examples $ []
          :schema $ quote $ Fn (Map Tag Dynamic) AnyEnum String Number
            -> $ Map Tag Dynamic
      :ns $ %{} 'NsEntry (:doc |)
        :code $ quote $ ns app.updater
          :require $ respo.cursor :refer $ update-states
